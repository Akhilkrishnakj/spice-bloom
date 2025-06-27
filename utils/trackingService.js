import Order from '../models/orderModel.js';

// 🚚 Professional Tracking Service
class TrackingService {
  constructor() {
    this.activeDeliveries = new Map();
    this.deliveryRoutes = new Map();
    this.initializeTracking();
  }

  // 🎯 Initialize tracking for new orders
  initializeTracking() {
    console.log('🚚 Tracking Service Initialized');
  }

  // 📍 Generate realistic delivery locations
  generateDeliveryLocation(order) {
    const baseLat = 12.9716; // Bangalore coordinates
    const baseLng = 77.5946;
    
    // Generate locations along delivery route
    const routePoints = [
      { lat: baseLat + 0.01, lng: baseLng + 0.01, name: 'Warehouse Processing Center' },
      { lat: baseLat + 0.005, lng: baseLng + 0.008, name: 'Distribution Hub A' },
      { lat: baseLat + 0.002, lng: baseLng + 0.005, name: 'Local Sorting Facility' },
      { lat: baseLat - 0.001, lng: baseLng + 0.003, name: 'Neighborhood Delivery Center' },
      { lat: baseLat - 0.002, lng: baseLng + 0.001, name: 'Final Delivery Route' }
    ];

    return routePoints;
  }

  // 🎯 Start tracking for an order
  async startTracking(orderId) {
    try {
      const order = await Order.findById(orderId).populate('buyer', 'name email');
      if (!order) return;

      const routePoints = this.generateDeliveryLocation(order);
      const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

      // Update order with tracking info
      order.tracking = {
        ...order.tracking,
        estimatedDelivery,
        currentLocation: routePoints[0],
        lastUpdate: new Date(),
        trackingNumber: `SPB${Date.now()}${Math.floor(Math.random() * 1000)}`,
      };

      await order.save();

      // Start live tracking simulation
      this.simulateLiveTracking(orderId, routePoints);

      // Emit initial tracking data
      this.emitTrackingUpdate(order);

      console.log(`🚚 Started tracking for order: ${order.orderNumber}`);
    } catch (error) {
      console.error('❌ Error starting tracking:', error);
    }
  }

  // 🔄 Simulate live tracking updates
  simulateLiveTracking(orderId, routePoints) {
    let currentPointIndex = 0;
    const updateInterval = setInterval(async () => {
      try {
        const order = await Order.findById(orderId);
        if (!order || order.status === 'delivered' || order.status === 'cancelled') {
          clearInterval(updateInterval);
          return;
        }

        // Update location based on status
        if (order.status === 'processing' && currentPointIndex < 1) {
          currentPointIndex = 1;
        } else if (order.status === 'shipped' && currentPointIndex < 2) {
          currentPointIndex = 2;
        } else if (order.status === 'out_for_delivery' && currentPointIndex < 3) {
          currentPointIndex = 3;
        } else if (order.status === 'delivered') {
          currentPointIndex = 4;
        }

        if (currentPointIndex < routePoints.length) {
          const currentLocation = routePoints[currentPointIndex];
          
          // Add some realistic movement
          const jitter = {
            lat: (Math.random() - 0.5) * 0.001,
            lng: (Math.random() - 0.5) * 0.001
          };

          order.tracking.currentLocation = {
            lat: currentLocation.lat + jitter.lat,
            lng: currentLocation.lng + jitter.lng,
            address: currentLocation.name,
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India'
          };
          order.tracking.lastUpdate = new Date();

          await order.save();
          this.emitTrackingUpdate(order);
        }
      } catch (error) {
        console.error('❌ Error in live tracking simulation:', error);
        clearInterval(updateInterval);
      }
    }, 30000); // Update every 30 seconds

    // Store interval reference for cleanup
    this.activeDeliveries.set(orderId, updateInterval);
  }

  // 📡 Emit tracking updates to connected clients
  emitTrackingUpdate(order) {
    const trackingData = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      tracking: order.tracking,
      statusTimeline: order.statusTimeline,
      estimatedDelivery: order.tracking?.estimatedDelivery,
      currentLocation: order.tracking?.currentLocation,
      lastUpdate: order.tracking?.lastUpdate,
      buyer: order.buyer
    };

    // Emit to all connected clients
    global.io.emit('tracking-update', trackingData);
    
    // Emit to specific user if they're connected
    if (order.buyer) {
      global.io.to(`user_${order.buyer._id}`).emit('order-tracking-update', trackingData);
    }
  }

  // 🎯 Update order status with tracking info
  async updateOrderStatus(orderId, newStatus, adminId, notes = '') {
    try {
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Order not found');

      const oldStatus = order.status;
      order.status = newStatus;

      // Add to status timeline
      order.statusTimeline.push({
        status: newStatus,
        timestamp: new Date(),
        location: order.tracking?.currentLocation,
        notes: notes || `Status updated from ${oldStatus} to ${newStatus}`,
        updatedBy: adminId
      });

      // Handle specific status updates
      if (newStatus === 'delivered') {
        order.delivery.deliveredDate = new Date();
        order.delivery.deliveryTime = new Date().toLocaleTimeString();
        this.stopTracking(orderId);
      } else if (newStatus === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancelledBy = adminId;
        this.stopTracking(orderId);
      } else if (newStatus === 'processing' && oldStatus === 'pending') {
        // Start tracking when order moves to processing
        this.startTracking(orderId);
      }

      await order.save();
      this.emitTrackingUpdate(order);

      console.log(`✅ Order ${order.orderNumber} status updated to ${newStatus}`);
      return order;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  // 🛑 Stop tracking for an order
  stopTracking(orderId) {
    const interval = this.activeDeliveries.get(orderId);
    if (interval) {
      clearInterval(interval);
      this.activeDeliveries.delete(orderId);
      console.log(`🛑 Stopped tracking for order: ${orderId}`);
    }
  }

  // 📊 Get tracking statistics
  async getTrackingStats() {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$total' }
          }
        }
      ]);

      const activeDeliveries = this.activeDeliveries.size;
      const totalOrders = await Order.countDocuments();

      return {
        statusBreakdown: stats,
        activeDeliveries,
        totalOrders,
        trackingCoverage: ((activeDeliveries / totalOrders) * 100).toFixed(2)
      };
    } catch (error) {
      console.error('❌ Error getting tracking stats:', error);
      return null;
    }
  }

  // 🗺️ Get delivery route for an order
  getDeliveryRoute(orderId) {
    const route = this.deliveryRoutes.get(orderId);
    return route || [];
  }

  // 🔄 Cleanup inactive deliveries
  cleanupInactiveDeliveries() {
    this.activeDeliveries.forEach((interval, orderId) => {
      // Check if order is still active
      Order.findById(orderId).then(order => {
        if (!order || order.status === 'delivered' || order.status === 'cancelled') {
          this.stopTracking(orderId);
        }
      });
    });
  }
}

// 🚀 Create singleton instance
const trackingService = new TrackingService();

// 🧹 Cleanup every hour
setInterval(() => {
  trackingService.cleanupInactiveDeliveries();
}, 60 * 60 * 1000);

export default trackingService; 