import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Search, Filter, Package, Truck, CheckCircle, Clock, X, ChevronDown, ChevronUp,
  RotateCcw, Phone, Star, Download, Eye, Calendar, MapPin, CreditCard, FileText, ShoppingBag,
  Navigation, Home, Store, Car, Users, AlertCircle, Zap
} from 'lucide-react';

const statusConfig = {
  processing: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/80', border: 'border-amber-200/50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-200/50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50/80', border: 'border-green-200/50', label: 'Delivered' },
  cancelled: { icon: X, color: 'text-red-600', bg: 'bg-red-50/80', border: 'border-red-200/50', label: 'Cancelled' }
};

// Tracking stages configuration
const trackingStages = [
  { id: 'ordered', label: 'Order Placed', icon: FileText, color: 'bg-green-500' },
  { id: 'processing', label: 'Processing', icon: Clock, color: 'bg-amber-500' },
  { id: 'packed', label: 'Packed', icon: Package, color: 'bg-blue-500' },
  { id: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Car, color: 'bg-indigo-500' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-600' }
];

// Add this helper for eligible cancel statuses
const cancellableStatuses = ["processing", "packed", "shipped", "out_for_delivery"];

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token: contextToken } = useAuth() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [liveUpdates, setLiveUpdates] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(null); // orderId or null

  // Simulate live tracking updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => {
        const updates = { ...prev };
        Object.keys(updates).forEach(orderId => {
          if (updates[orderId].status !== 'delivered') {
            // Simulate location updates
            updates[orderId].currentLocation = {
              lat: 12.9716 + (Math.random() - 0.5) * 0.01,
              lng: 77.5946 + (Math.random() - 0.5) * 0.01,
              address: `Location ${Math.floor(Math.random() * 1000)}`
            };
            updates[orderId].lastUpdate = new Date().toISOString();
          }
        });
        return updates;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = contextToken || localStorage.getItem('authToken');
        const { data } = await axios.get('/api/v1/order/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const ordersWithTracking = (data.orders || []).map(order => ({
          ...order,
          trackingStages: generateTrackingStages(order.status),
          estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          currentLocation: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.01,
            lng: 77.5946 + (Math.random() - 0.5) * 0.01,
            address: 'Warehouse Processing Center'
          }
        }));
        
        setOrders(ordersWithTracking);
        
        // Initialize live updates for shipped orders
        const updates = {};
        ordersWithTracking.forEach(order => {
          if (order.status === 'shipped' || order.status === 'out_for_delivery') {
            updates[order.id] = {
              status: order.status,
              currentLocation: order.currentLocation,
              lastUpdate: new Date().toISOString(),
              eta: order.estimatedDelivery
            };
          }
        });
        setLiveUpdates(updates);
        
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [contextToken]);

  const generateTrackingStages = (currentStatus) => {
    const statusOrder = ['ordered', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return trackingStages.map((stage, index) => ({
      ...stage,
      completed: index <= currentIndex,
      active: index === currentIndex,
      timestamp: new Date(Date.now() - (currentIndex - index) * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-lg text-gray-700 font-medium">Loading your orders...</div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
SPICEBLOOM INVOICE
==================

Invoice #: ${order.orderNumber}
Date: ${formatDate(order.date)}
${order.deliveredDate ? `Delivered: ${formatDate(order.deliveredDate)}` : ''}

BILL TO:
${order.shippingAddress.name}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
${order.shippingAddress.country}

ITEMS:
${order.items.map(item =>
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}

SUMMARY:
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

Payment Method: ${order.paymentMethod}
${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''}

Thank you for choosing SpiceBloom!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpiceBloom-Invoice-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm ${config.bg} ${config.color} ${config.border}`}>
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  const TrackingTimeline = ({ order }) => {
    const currentUpdate = liveUpdates[order.id];
    
    return (
      <div className="backdrop-blur-lg bg-white/30 rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Live Tracking</h4>
            <p className="text-sm text-gray-600">Real-time updates</p>
          </div>
          {currentUpdate && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">LIVE</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {order.trackingStages.filter(stage => stage.completed).length} of {order.trackingStages.length} stages
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(order.trackingStages.filter(stage => stage.completed).length / order.trackingStages.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {order.trackingStages.map((stage, index) => {
            const Icon = stage.icon;
            const isLast = index === order.trackingStages.length - 1;
            
            return (
              <div key={stage.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    stage.completed 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent' 
                      : stage.active
                      ? 'bg-white border-blue-500 shadow-lg'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      stage.completed ? 'text-white' : stage.active ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-8 mt-2 transition-all duration-300 ${
                      stage.completed ? 'bg-gradient-to-b from-green-500 to-blue-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h5 className={`font-medium ${
                      stage.completed ? 'text-gray-900' : stage.active ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stage.label}
                    </h5>
                    {stage.timestamp && (
                      <span className="text-xs text-gray-400">
                        {formatTime(stage.timestamp)}
                      </span>
                    )}
                  </div>
                  {stage.active && currentUpdate && (
                    <div className="mt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <MapPin className="w-4 h-4" />
                        <span>{currentUpdate.currentLocation?.address || 'In transit'}</span>
                      </div>
                      <div className="mt-1 text-xs text-blue-600">
                        Last updated: {formatTime(currentUpdate.lastUpdate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ETA Information */}
        {order.estimatedDelivery && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-xl border border-green-200/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-600">{formatDate(order.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProductModal = ({ item, order, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="sticky top-0 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 p-6 flex items-center justify-between rounded-t-3xl">
          <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100/80 text-green-800 text-sm font-medium rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <p className="font-medium text-gray-900">{item.weight}</p>
                </div>
                <div>
                  <span className="text-gray-600">Origin:</span>
                  <p className="font-medium text-gray-900">{item.origin}</p>
                </div>
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <p className="font-medium text-gray-900">{item.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="font-medium text-gray-900">${item.price.toFixed(2)} each</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-green-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-gray-600">Total for this item</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3">Description</h5>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3">Order Information</h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order Number:</span>
                <p className="font-medium text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <p className="font-medium text-gray-900">{formatDate(order.date)}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="text-gray-600">Tracking:</span>
                  <p className="font-medium text-gray-900 font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg">
              <RotateCcw className="w-4 h-4" />
              Reorder This Item
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-green-600 text-green-600 rounded-xl hover:bg-green-50/50 transition-colors font-medium backdrop-blur-sm">
              <ShoppingBag className="w-4 h-4" />
              View Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add cancel order handler
  const handleCancelOrder = async (orderId) => {
    // Optionally, show loading state here
    try {
      // Placeholder: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      setShowCancelConfirm(null);
    } catch (err) {
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Spice<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Bloom</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Products</a>
              <a href="#" className="text-green-600 font-medium">My Orders</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Account</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h2>
          <p className="text-gray-600">Track and manage your spice orders with live updates</p>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors backdrop-blur-sm bg-white/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300/50 rounded-xl hover:bg-white/50 transition-colors backdrop-blur-sm"
              >
                <Filter className="w-5 h-5" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    statusFilter === 'all'
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70 border border-gray-300/50'
                  }`}
                >
                  All Orders
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/50 text-gray-700 hover:bg-white/70 border border-gray-300/50'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order {order.orderNumber}</h3>
                          <p className="text-gray-600">{formatDate(order.date)}</p>
                          {order.deliveredDate && (
                            <p className="text-sm text-green-600 font-medium">
                              Delivered on {formatDate(order.deliveredDate)}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <p className="text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'delivered' && (
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50/50 rounded-xl transition-colors text-sm font-medium backdrop-blur-sm"
                            >
                              <Download className="w-4 h-4" />
                              Invoice
                            </button>
                          )}
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Preview Items */}
                    <div className="mt-4 flex -space-x-2">
                      {order.items.slice(0, 4).map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedProduct({ item, order })}
                          className="relative group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl border-2 border-white/80 object-cover hover:scale-110 transition-transform cursor-pointer shadow-lg"
                          />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.name}
                          </div>
                        </button>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-12 h-12 rounded-xl border-2 border-white/80 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
                      <div className="p-6">
                        {/* Live Tracking Section */}
                        <TrackingTimeline order={order} />

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200/30 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-blue-900">Tracking Information</span>
                            </div>
                            <p className="text-blue-800">Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                            {order.estimatedDelivery && (
                              <p className="text-blue-800">Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                            )}
                          </div>
                        )}

                        {/* Shipping Address */}
                        <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Shipping Address</span>
                          </div>
                          <div className="text-gray-700">
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4 mb-6">
                          <h4 className="font-semibold text-gray-900">Order Items</h4>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                              <button
                                onClick={() => setSelectedProduct({ item, order })}
                                className="flex-shrink-0 group relative"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-black/50 backdrop-blur-sm rounded-xl p-2">
                                    <Eye className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              </button>
                              <div className="flex-1">
                                <button
                                  onClick={() => setSelectedProduct({ item, order })}
                                  className="text-left hover:text-green-600 transition-colors"
                                >
                                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                                </button>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-sm text-gray-500">{item.weight} • {item.origin}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mb-6 p-4 bg-white/60 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                          <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="text-gray-900">${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200/50 pt-2 mt-2">
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-gray-900">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>Paid with {order.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200/50">
                          {/* Reorder button: lets user add all items from this order to cart for a new purchase */}
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg">
                            <RotateCcw className="w-4 h-4" />
                            Reorder
                          </button>
                          {/* Cancel Order button for eligible statuses */}
                          {cancellableStatuses.includes(order.status) && (
                            <button
                              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-xl hover:bg-red-50/50 transition-colors backdrop-blur-sm"
                              onClick={() => setShowCancelConfirm(order.id)}
                            >
                              <X className="w-4 h-4" />
                              Cancel Order
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-xl hover:bg-green-50/50 transition-colors backdrop-blur-sm">
                                <Star className="w-4 h-4" />
                                Leave Review
                              </button>
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50/50 transition-colors backdrop-blur-sm"
                              >
                                <Download className="w-4 h-4" />
                                Download Invoice
                              </button>
                            </>
                          )}
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/50 transition-colors backdrop-blur-sm">
                            <Phone className="w-4 h-4" />
                            Contact Support
                          </button>
                        </div>
                        {/* Cancel confirmation modal */}
                        {showCancelConfirm === order.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="bg-white/80 rounded-2xl p-8 shadow-2xl border border-white/30 max-w-sm w-full">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                              <p className="text-gray-700 mb-6">Are you sure you want to cancel order <span className="font-mono">{order.orderNumber}</span>? This cannot be undone.</p>
                              <div className="flex gap-3 justify-end">
                                <button
                                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100/60 transition-colors"
                                  onClick={() => setShowCancelConfirm(null)}
                                >
                                  No, Go Back
                                </button>
                                <button
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Yes, Cancel Order
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          item={selectedProduct.item}
          order={selectedProduct.order}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;