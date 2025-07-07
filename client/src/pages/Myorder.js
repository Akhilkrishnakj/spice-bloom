import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Search, Filter, Package, Truck, CheckCircle, Clock, X, ChevronDown, ChevronUp,
  RotateCcw, Phone, Star, Download, Eye, Calendar, MapPin, CreditCard, FileText, ShoppingBag,
  Navigation, Home, Store, Car, Users, AlertCircle, Zap, ArrowRight, PlayCircle, PauseCircle,
  RefreshCw, RotateCcw as ReturnIcon, DollarSign, CheckCircle2, XCircle, ArrowLeft
} from 'lucide-react';
import Layout from '../components/Layouts/Layout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import Invoice from '../components/Invoice';
import socket from '../socket';
import toast from 'react-hot-toast';
import axios from 'axios';

const statusConfig = {
  processing: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/80', border: 'border-amber-200/50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-200/50', label: 'Shipped' },
  out_for_delivery: { icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-50/80', border: 'border-indigo-200/50', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50/80', border: 'border-green-200/50', label: 'Delivered' },
  cancelled: { icon: X, color: 'text-red-600', bg: 'bg-red-50/80', border: 'border-red-200/50', label: 'Cancelled' }
};

console.log('socket:', socket);
console.log('typeof socket.connect:', typeof socket.connect);

// Enhanced tracking stages configuration
const trackingStages = [
  { 
    id: 'processing', 
    label: 'Processing', 
    icon: Package, 
    color: 'from-yellow-500 to-orange-500',
    description: 'Your items are being prepared for shipment'
  },
  { 
    id: 'shipped', 
    label: 'Shipped', 
    icon: Truck, 
    color: 'from-purple-500 to-indigo-500',
    description: 'Your order is on its way to you'
  },
  { 
    id: 'out_for_delivery', 
    label: 'Out for Delivery', 
    icon: Car, 
    color: 'from-indigo-500 to-blue-600',
    description: 'Your order is out for delivery today'
  },
  { 
    id: 'delivered', 
    label: 'Delivered', 
    icon: CheckCircle, 
    color: 'from-green-500 to-emerald-600',
    description: 'Your order has been successfully delivered'
  },
  { 
    id: 'cancelled', 
    label: 'Cancelled', 
    icon: X, 
    color: 'from-red-500 to-red-600',
    description: 'Your order has been cancelled'
  }
];

// Add this helper for eligible cancel statuses
const cancellableStatuses = ["processing", "packed", "shipped", "out_for_delivery"];

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token: contextToken, user } = useAuth() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [liveUpdates, setLiveUpdates] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState({ open: false, order: null });
  const [showReturnModal, setShowReturnModal] = useState({ open: false, order: null, itemIndex: null });
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/order/my-orders');
        
        const ordersWithTracking = (data.orders || []).map(order => ({
          ...order,
          trackingStages: generateTrackingStages(order.status, order),
          estimatedDelivery: order.tracking?.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          currentLocation: order.tracking?.currentLocation || {
            lat: 12.9716 + (Math.random() - 0.5) * 0.01,
            lng: 77.5946 + (Math.random() - 0.5) * 0.01,
            address: 'Warehouse Processing Center, Distribution Hub A'
          }
        }));
        
        setOrders(ordersWithTracking);
        
        // Initialize live updates for active orders
        const updates = {};
        ordersWithTracking.forEach(order => {
          if (['processing', 'shipped', 'out_for_delivery'].includes(order.status.toLowerCase())) {
            updates[order._id] = {
              status: order.status,
              currentLocation: order.currentLocation,
              lastUpdate: order.tracking?.lastUpdate || new Date().toISOString(),
              eta: order.estimatedDelivery,
              estimatedMinutes: Math.floor(Math.random() * 180) + 60
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

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit('join-user-room', user._id);

      socket.on("order-status-update", (updateOrder) => {
        console.log('📦 Received order status update:', updateOrder);
        console.log('📦 New status:', updateOrder.status);
        console.log('📦 Order ID:', updateOrder._id);
        
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === updateOrder._id ? { 
              ...order, 
              ...updateOrder,
              trackingStages: generateTrackingStages(updateOrder.status || order.status, order)
            } : order
          );
          console.log('📦 Updated orders:', updatedOrders);
          return updatedOrders;
        });
      });

      socket.on("tracking-update", (trackingData) => {
        console.log('🚚 Received tracking update:', trackingData);
        if (trackingData.orderId) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === trackingData.orderId 
                ? { 
                    ...order, 
                    tracking: trackingData.tracking,
                    currentLocation: trackingData.currentLocation,
                    estimatedDelivery: trackingData.estimatedDelivery,
                    status: trackingData.status,
                    trackingStages: generateTrackingStages(trackingData.status || order.status, order)
                  } 
                : order
            )
          );

          setLiveUpdates(prev => ({
            ...prev,
            [trackingData.orderId]: {
              status: trackingData.status,
              currentLocation: trackingData.currentLocation,
              lastUpdate: trackingData.lastUpdate,
              eta: trackingData.estimatedDelivery,
              estimatedMinutes: Math.floor(Math.random() * 180) + 60
            }
          }));
        }
      });

      socket.on("order-tracking-update", (trackingData) => {
        console.log('🎯 Received personal tracking update:', trackingData);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === trackingData.orderId 
              ? { 
                  ...order, 
                  tracking: trackingData.tracking,
                  currentLocation: trackingData.currentLocation,
                  estimatedDelivery: trackingData.estimatedDelivery,
                  statusTimeline: trackingData.statusTimeline,
                  status: trackingData.status,
                  trackingStages: generateTrackingStages(trackingData.status || order.status, order)
                } 
              : order
          )
        );
      });

      // 🔄 Return request updates
      socket.on("return-request-update", (returnData) => {
        console.log('🔄 Received return request update:', returnData);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === returnData.orderId 
              ? {
                  ...order,
                  items: order.items.map((item, index) =>
                    index === returnData.itemIndex
                      ? { ...item, returnRequest: returnData.returnRequest }
                      : item
                  )
                }
              : order
          )
        );
        toast.success('Return request status updated!');
      });

      // 💰 Refund processed notification
      socket.on("refund-processed", (refundData) => {
        console.log('💰 Refund processed:', refundData);
        toast.success(`Refund of ₹${refundData.refundAmount} processed successfully!`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === refundData.orderId 
              ? {
                  ...order,
                  items: order.items.map((item, index) =>
                    index === refundData.itemIndex
                      ? { 
                          ...item, 
                          returnRequest: { 
                            ...item.returnRequest, 
                            status: 'refunded',
                            refundedAt: new Date(),
                            refundAmount: refundData.refundAmount
                          }
                        }
                      : item
                  )
                }
              : order
          )
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?._id]);

  const generateTrackingStages = (currentStatus, order = null) => {
    console.log('🎯 Generating tracking stages for status:', currentStatus);
    console.log('🎯 Order data:', order);
    
    // If we have order data with statusTimeline, use it for cancelled orders
    if (order && order.statusTimeline && order.statusTimeline.length > 0 && currentStatus.toLowerCase() === 'cancelled') {
      // Only keep the first 'cancelled' entry
      let cancelledFound = false;
      const timelineStages = order.statusTimeline
        .filter(entry => {
          if (entry.status === 'cancelled') {
            if (!cancelledFound) {
              cancelledFound = true;
              return true;
            }
            return false; // skip duplicates
          }
          return true;
        })
        .map((timelineEntry, index) => {
          const stageConfig = trackingStages.find(stage => stage.id === timelineEntry.status);
          const Icon = stageConfig ? stageConfig.icon : Clock;
          return {
            id: timelineEntry.status,
            label: stageConfig ? stageConfig.label : timelineEntry.status.charAt(0).toUpperCase() + timelineEntry.status.slice(1),
            icon: Icon,
            color: stageConfig ? stageConfig.color : 'from-gray-500 to-gray-600',
            description: stageConfig ? stageConfig.description : `Order status: ${timelineEntry.status}`,
            completed: true, // All timeline entries are completed
            active: false,
            cancelled: timelineEntry.status === 'cancelled',
            timestamp: timelineEntry.timestamp,
            notes: timelineEntry.notes,
            location: timelineEntry.location
          };
        });
      // Add cancelled stage if not already in timeline
      if (!timelineStages.find(stage => stage.id === 'cancelled')) {
        const cancelledStage = {
          id: 'cancelled',
          label: 'Cancelled',
          icon: X,
          color: 'from-red-500 to-red-600',
          description: 'Your order has been cancelled',
          completed: false,
          active: true,
          cancelled: true,
          timestamp: order.cancelledAt || new Date().toISOString(),
          notes: order.cancellationReason || 'Order cancelled by user'
        };
        timelineStages.push(cancelledStage);
      }
      console.log('🎯 Generated timeline stages:', timelineStages);
      return timelineStages;
    }
    
    // Fallback to original logic for non-cancelled orders or orders without timeline
    const statusOrder = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
    let currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    console.log('🎯 Current index:', currentIndex);
    
    if (currentIndex === -1) currentIndex = 0;
    
    let stages = trackingStages
      .filter(stage => {
        // Only include 'cancelled' if the order is actually cancelled
        if (stage.id === 'cancelled') {
          return currentStatus.toLowerCase() === 'cancelled';
        }
        return true;
      })
      .map((stage, index) => ({
        ...stage,
        completed: index < currentIndex,
        active: index === currentIndex,
        cancelled: false,
        timestamp: index <= currentIndex ? 
          new Date(Date.now() - (currentIndex - index) * 24 * 60 * 60 * 1000).toISOString() : 
          null
      }));
    
    console.log('🎯 Generated stages:', stages);
    return stages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <div className="text-lg text-gray-700 font-medium">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || (order.status && order.status.toLowerCase() === statusFilter);
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
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Amazon-style header
    doc.setFontSize(18);
    doc.text('INVOICE', 14, 18);
    doc.setFontSize(12);
    doc.text(`Order #: ${order.orderNumber}`, 14, 28);
    doc.text(`Order Date: ${formatDate(order.createdAt)}`, 14, 36);
    if (order.delivery?.deliveredDate) doc.text(`Delivered: ${formatDate(order.delivery.deliveredDate)}`, 14, 44);

    // Shipping Address
    doc.setFontSize(14);
    doc.text('Shipping Address:', 14, 54);
    doc.setFontSize(11);
    let y = 60;
    [order.shippingAddress.name, order.shippingAddress.street, `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`, order.shippingAddress.country]
      .forEach(line => { doc.text(line, 14, y); y += 6; });

    // Table of items
    doc.setFontSize(13);
    doc.text('Order Details:', 14, y + 4);
    autoTable(doc, {
      startY: y + 8,
      head: [['Product', 'Qty', 'Unit Price', 'Total']],
      body: order.items.map(item => [item.name, item.quantity, `₹${item.price.toFixed(2)}`, `₹${(item.price * item.quantity).toFixed(2)}`]),
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold' },
      bodyStyles: { textColor: 50 },
      styles: { fontSize: 11, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 15 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 } }
    });
    let finalY = doc.lastAutoTable.finalY + 6;

    // Summary
    doc.setFontSize(12);
    doc.text('Summary:', 14, finalY);
    doc.setFontSize(11);
    doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`, 14, finalY + 6);
    doc.text(`Shipping: ₹${order.shipping.toFixed(2)}`, 14, finalY + 12);
    doc.text(`Tax: ₹${order.tax.toFixed(2)}`, 14, finalY + 18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ₹${order.total.toFixed(2)}`, 14, finalY + 26);
    doc.setFont('helvetica', 'normal');

    // Payment Method
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, finalY + 36);
    if (order.tracking?.trackingNumber) doc.text(`Tracking: ${order.tracking.trackingNumber}`, 14, finalY + 42);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for shopping with SpiceBloom!', 14, 285);

    doc.save(`SpiceBloom-Invoice-${order.orderNumber}.pdf`);
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status.toLowerCase()];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm ${config.bg} ${config.color} ${config.border}`}>
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  // Enhanced Live Tracking Component
  const EnhancedLiveTracking = ({ order }) => {
    const currentUpdate = liveUpdates[order._id];
    const activeStageIndex = order.trackingStages.findIndex(stage => stage.active);
    const progress = order.status === 'cancelled' ? 100 : ((activeStageIndex + 1) / order.trackingStages.length) * 100;
    
    return (
      <div className="space-y-6">
        {/* Header with Live Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                order.status === 'cancelled' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500'
              }`}>
                {order.status === 'cancelled' ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                <Navigation className="w-6 h-6 text-white" />
                )}
              </div>
              {currentUpdate && order.status !== 'cancelled' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                {order.status === 'cancelled' ? 'Order Cancelled' : 'Live Package Tracking'}
              </h4>
              <p className="text-sm text-gray-600">
                {order.status === 'cancelled' 
                  ? 'This order has been cancelled' 
                  : 'Real-time location and status updates'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${
              order.status === 'cancelled' 
                ? 'bg-red-100/80 text-red-700' 
                : 'bg-blue-100/80 text-blue-700'
            }`}>
              {order.status === 'cancelled' ? 'Order Status' : 'Order Status Timeline'}
            </span>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => setShowCancelConfirm(order._id)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
            
        {/* Progress Overview */}
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/30 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-700">
              {order.status === 'cancelled' ? 'Order Status' : 'Delivery Progress'}
            </span>
            <span className={`text-sm font-medium ${
              order.status === 'cancelled' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {order.status === 'cancelled' ? 'Cancelled' : `${Math.round(progress)}% Complete`}
            </span>
          </div>
          
          <div className="relative w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                order.status === 'cancelled' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500'
              }`}
              style={{ width: `${progress}%` }}
            >
              {order.status !== 'cancelled' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              )}
            </div>
          </div>

          {currentUpdate && order.status !== 'cancelled' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Current Location</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{currentUpdate.currentLocation?.address}</p>
                <p className="text-xs text-gray-500">Updated {formatTime(currentUpdate.lastUpdate)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Timeline */}
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/30 shadow-lg">
          <h5 className="font-bold text-lg text-gray-900 mb-6">
            {order.status === 'cancelled' ? 'Order Timeline' : 'Tracking Timeline'}
          </h5>
          
          <div className="space-y-6">
            {order.trackingStages.map((stage, index) => {
              const Icon = stage.icon;
              const isLast = index === order.trackingStages.length - 1;
              const isActive = stage.active;
              const isCompleted = stage.completed;
              const isCancelled = stage.cancelled;
              
              return (
                <div key={stage.id} className="flex items-start gap-4 relative">
                  {/* Connection Line */}
                  {!isLast && (
                    <div className={`absolute left-6 top-12 w-0.5 h-8 transition-all duration-500 ${
                      isCompleted || isCancelled ? `bg-gradient-to-b ${stage.color}` : 'bg-gray-200'
                    }`}></div>
                  )}
                  
                  {/* Status Icon */}
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-500 ${
                      isCancelled 
                        ? `bg-gradient-to-r ${stage.color} border-transparent shadow-lg`
                        : isCompleted 
                        ? `bg-gradient-to-r ${stage.color} border-transparent shadow-lg`
                        : isActive 
                        ? 'bg-white border-blue-500 shadow-xl ring-4 ring-blue-100'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isCancelled ? 'text-white' : isCompleted ? 'text-white' : isActive ? 'text-blue-500' : 'text-gray-400'
                      } ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    {/* Animated ring for active stage */}
                    {isActive && !isCancelled && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Stage Details */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className={`font-semibold text-lg transition-colors ${
                        isCancelled ? 'text-red-600' : isCompleted ? 'text-gray-900' : isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {stage.label}
                        {isActive && !isCancelled && <span className="ml-2 text-sm text-blue-500 animate-pulse">●</span>}
                        {isCancelled && <span className="ml-2 text-sm text-red-500">●</span>}
                      </h6>
                      {stage.timestamp && (
                        <span className="text-sm text-gray-400 font-medium">
                          {formatTime(stage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      isCancelled ? 'text-red-600' : isCompleted ? 'text-gray-700' : isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stage.description}
                    </p>
                    
                    {/* Additional Timeline Information */}
                    {(stage.notes || stage.location) && (
                      <div className="mt-3 p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
                        {stage.notes && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes:</span>
                            <p className="text-sm text-gray-700 mt-1">{stage.notes}</p>
                          </div>
                        )}
                        {stage.location && stage.location.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location:</span>
                              <p className="text-sm text-gray-700 mt-1">{stage.location.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Live Updates for Active Stage */}
                    {isActive && currentUpdate && !isCancelled && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-800">{currentUpdate.currentLocation?.address}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-600">Last Update:</span>
                                <p className="font-medium text-blue-800">{formatTime(currentUpdate.lastUpdate)}</p>
                              </div>
                              {currentUpdate.estimatedMinutes && (
                                <div>
                                  <span className="text-blue-600">ETA:</span>
                                  <p className="font-medium text-blue-800">{currentUpdate.estimatedMinutes} mins</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated Delivery Card */}
        {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-50/80 to-blue-50/80 rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h6 className="font-bold text-gray-900 text-lg">Estimated Delivery</h6>
                <p className="text-emerald-700 font-semibold text-lg">{formatDate(order.estimatedDelivery)}</p>
                {currentUpdate?.estimatedMinutes && (
                  <p className="text-sm text-gray-600 mt-1">
                    Approximately {currentUpdate.estimatedMinutes} minutes remaining
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL;


  // Cancel Order Handler
  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(orderId);
    try {
      const token = contextToken || localStorage.getItem('authToken');
      const { data } = await axios.post(`${API_BASE_URL}/order/cancel`, {
        orderId: orderId,
        reason: 'Cancelled by user'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        // Custom message for Razorpay
        if (data.order.paymentMethod === 'razorpay') {
          toast.success('Order cancelled successfully! Refund will be credited to your original payment method in 3-5 business days.');
        } else if (data.order.paymentMethod === 'wallet') {
          toast.success(`Order cancelled successfully! ₹${data.refundAmount} refunded to your wallet.`);
        } else {
          toast.success('Order cancelled successfully!');
        }
        // Update local state with the updated order
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId 
              ? { 
                  ...data.order, 
                  trackingStages: generateTrackingStages("cancelled", data.order)
                } 
              : order
          )
        );
        setShowCancelConfirm(null);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error(err.response?.data?.message || "Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(null);
    }
  };

  // Return Request Handler
  const handleReturnRequest = async () => {
    if (!returnReason || !returnDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmittingReturn(true);
    try {
      const token = contextToken || localStorage.getItem('authToken');
      const { data } = await axios.post(`${API_BASE_URL}/order/return/request`, {
        orderId: showReturnModal.order._id,
        itemIndex: showReturnModal.itemIndex,
        reason: returnReason,
        description: returnDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success('Return request submitted successfully!');
        setShowReturnModal({ open: false, order: null, itemIndex: null });
        setReturnReason('');
        setReturnDescription('');
        
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order._id === showReturnModal.order._id
              ? {
                  ...order,
                  items: order.items.map((item, index) =>
                    index === showReturnModal.itemIndex
                      ? { ...item, returnRequest: data.returnRequest }
                      : item
                  )
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Cancel Confirmation Modal
  const CancelConfirmationModal = ({ orderId, onConfirm, onCancel }) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl max-w-md w-full shadow-2xl border border-white/20">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel order <span className="font-semibold">{order.orderNumber}</span>?
              </p>
            </div>
            
            <div className="bg-gray-50/80 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Current Status:</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={cancellingOrder === orderId}
              >
                Keep Order
              </button>
              <button
                onClick={() => onConfirm(orderId)}
                disabled={cancellingOrder === orderId}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancellingOrder === orderId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 relative overflow-hidden">
        {/* Glassmorphic background effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-green-200/15 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-bl from-teal-200/10 to-green-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: `radial-gradient(circle at 1px 1px, rgb(34,197,94) 1px, transparent 0)`, backgroundSize: '40px 40px'}}></div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb and Back Button Header */}
          <div className="w-full mb-6">
            <div className="flex items-center gap-2 md:gap-4 w-full">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <nav className="text-sm md:text-base text-emerald-500 font-medium flex items-center gap-1" aria-label="Breadcrumb">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span className="mx-1 text-emerald-400">/</span>
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/profile')}>Profile</span>
                <span className="mx-1 text-emerald-400">/</span>
                <span className="text-emerald-700 font-semibold">My Orders</span>
              </nav>
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">My Orders</h2>
            <p className="text-slate-600">Track and manage your spice orders with live updates</p>
          </div>

          {/* Search and Filters */}
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
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
          <div className="space-y-8">
            {filteredOrders.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order._id;
                const canCancel = order.status !== 'cancelled' && order.status !== 'delivered' && cancellableStatuses.includes(order.status.toLowerCase());

                return (
                  <div key={order._id} className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-emerald-200/40 transition-all duration-300">
                    {/* Order Header */}
                    <div className="p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Order {order.orderNumber}</h3>
                          <p className="text-slate-600">{formatDate(order.createdAt)}</p>
                          {order.delivery?.deliveredDate && (
                            <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> Delivered on {formatDate(order.delivery.deliveredDate)}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">₹{order.total.toFixed(2)}</p>
                          <p className="text-slate-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex gap-2">
                          {canCancel && (
                            <button
                              onClick={() => setShowCancelConfirm(order._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-xl hover:bg-red-50/50 transition-colors backdrop-blur-sm font-medium"
                            >
                              <X className="w-4 h-4" /> Cancel
                            </button>
                          )}
                          <button
                            onClick={() => setShowInvoice({ open: true, order })}
                            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50/50 transition-colors backdrop-blur-sm font-semibold shadow-lg"
                          >
                            <Download className="w-5 h-5" /> Download Invoice
                          </button>
                          <button
                            onClick={() => toggleOrderExpansion(order._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="border-t border-emerald-100/50 bg-gradient-to-r from-white/70 to-emerald-50/50">
                        <div className="p-8 space-y-8">
                          {/* Product and Shipping Info */}
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Product Details */}
                            <div className="space-y-6">
                              <h4 className="font-bold text-lg text-slate-900">Product Details</h4>
                              {order.items.map((item, itemIndex) => (
                                <div key={item._id} className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-emerald-100/50 shadow-sm">
                                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-lg" />
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-slate-900">{item.name}</h5>
                                    <p className="text-slate-600 text-sm">Qty: {item.quantity} • {item.weight} • {item.origin}</p>
                                    
                                    {/* Return Status Indicator */}
                                    {order.status === 'delivered' && item.returnRequest && (
                                      <div className="mt-2">
                                        {(!item.returnRequest.status || item.returnRequest.status === 'none') && (
                                          <button
                                            onClick={() => setShowReturnModal({ open: true, order, itemIndex })}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                                          >
                                            <ReturnIcon className="w-4 h-4" />
                                            Request Return
                                          </button>
                                        )}
                                        {item.returnRequest.status === 'requested' && (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            Return Requested
                                          </div>
                                        )}
                                        {item.returnRequest.status === 'approved' && (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Return Approved
                                          </div>
                                        )}
                                        {item.returnRequest.status === 'returned' && (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                            <Package className="w-4 h-4" />
                                            Item Returned
                                          </div>
                                        )}
                                        {item.returnRequest.status === 'refunded' && (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                                            <DollarSign className="w-4 h-4" />
                                            Refunded ₹{item.returnRequest.refundAmount}
                                          </div>
                                        )}
                                        {item.returnRequest.status === 'rejected' && (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                            <XCircle className="w-4 h-4" />
                                            Return Rejected
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-emerald-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-xs text-slate-500">₹{item.price.toFixed(2)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Shipping & Summary */}
                            <div className="space-y-6">
                              <div className="bg-white/80 rounded-2xl border border-emerald-100/50 p-4 shadow-sm">
                                <h4 className="font-bold text-lg text-slate-900 mb-2">Shipping Address</h4>
                                <div className="text-slate-700">
                                  <p className="font-medium">{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                              <div className="bg-white/80 rounded-2xl border border-emerald-100/50 p-4 shadow-sm">
                                <h4 className="font-bold text-lg text-slate-900 mb-2">Order Summary</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between"><span className="text-slate-600">Subtotal:</span><span className="text-slate-900">₹{order.subtotal.toFixed(2)}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Shipping:</span><span className="text-slate-900">₹{order.shipping.toFixed(2)}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Tax:</span><span className="text-slate-900">₹{order.tax.toFixed(2)}</span></div>
                                  <div className="border-t border-emerald-100/50 pt-2 mt-2 flex justify-between font-semibold"><span className="text-slate-900">Total:</span><span className="text-slate-900">₹{order.total.toFixed(2)}</span></div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-emerald-100/50 flex items-center gap-2 text-sm text-slate-600">
                                  <CreditCard className="w-4 h-4" />
                                  <span>Paid with {order.paymentMethod}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Live Tracking Section */}
                          <div>
                            <EnhancedLiveTracking order={order} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <CancelConfirmationModal
            orderId={showCancelConfirm}
            onConfirm={handleCancelOrder}
            onCancel={() => setShowCancelConfirm(null)}
          />
        )}

        {/* Invoice Modal */}
        {showInvoice.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative print:p-0 print:bg-white">
              <button
                onClick={() => setShowInvoice({ open: false, order: null })}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold print:hidden"
              >
                ×
              </button>
              <Invoice order={showInvoice.order} />
              <div className="flex justify-end mt-6 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                >
                  Print / Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Request Modal */}
        {showReturnModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ReturnIcon className="h-6 w-6 text-orange-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Return</h2>
                    <p className="text-sm text-gray-500">{showReturnModal.order?.orderNumber} - {showReturnModal.order?.items[showReturnModal.itemIndex]?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReturnModal({ open: false, order: null, itemIndex: null })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Item Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={showReturnModal.order?.items[showReturnModal.itemIndex]?.image} 
                      alt={showReturnModal.order?.items[showReturnModal.itemIndex]?.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{showReturnModal.order?.items[showReturnModal.itemIndex]?.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {showReturnModal.order?.items[showReturnModal.itemIndex]?.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{showReturnModal.order?.items[showReturnModal.itemIndex]?.price}</p>
                    </div>
                  </div>
                </div>

                {/* Return Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason *</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Quality Issue">Quality Issue</option>
                    <option value="Not as Described">Not as Described</option>
                    <option value="Size Issue">Size Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    placeholder="Please provide details about why you want to return this item..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Return Policy Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Return Policy</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Returns accepted within 7 days of delivery</li>
                    <li>• Item must be in original condition</li>
                    <li>• Full refund will be processed within 2-3 minutes</li>
                    <li>• Return shipping label will be provided</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowReturnModal({ open: false, order: null, itemIndex: null })}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    disabled={submittingReturn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturnRequest}
                    disabled={submittingReturn || !returnReason || !returnDescription}
                    className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingReturn ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ReturnIcon className="w-4 h-4" />
                        Submit Return Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;