import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, ChevronDown, ChevronUp, CheckCircle, Truck, Clock, X as XIcon, Package, Car } from 'lucide-react';
import axios from 'axios';
import socket from '../../socket';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  { key: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Clock },
  { key: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: Car },
  { key: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XIcon },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    
    // Connect to socket for real-time updates
    socket.connect();
    socket.emit('join-admin-room');
    
    socket.on('order-status-update', (updatedOrder) => {
      setOrders((prev) => prev.map((o) => o._id === updatedOrder._id ? updatedOrder : o));
    });
    
    return () => {
      socket.off('order-status-update');
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
      const matchesSearch =
      order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.buyer?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortAsc) return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleStatusChange = async (order, newStatus) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/orders/${order._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (data.success) {
        toast.success('Order status updated');
        setOrders((prev) => prev.map((o) => o._id === order._id ? data.updatedOrder : o));
        socket.emit('order-status-update', data.updatedOrder);
        setShowStatusDropdown(null);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/v1/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success('Order deleted');
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusObj = (status) => STATUS_OPTIONS.find(s => s.key === status) || STATUS_OPTIONS[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb and Back Button Header */}
        <div className="w-full mb-4">
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Go back"
            >
              <ChevronUp className="w-5 h-5 rotate-90" />
            </button>
            <nav className="text-sm md:text-base text-emerald-500 font-medium flex items-center gap-1" aria-label="Breadcrumb">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</span>
              <span className="mx-1 text-emerald-400">/</span>
              <span className="text-emerald-700 font-semibold">Orders Management</span>
            </nav>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800 tracking-tight">SpiceBloom Orders</h1>
                </div>
          <input
            type="text"
            placeholder="Search by order, user, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white"
            style={{ minWidth: 260 }}
          />
              </div>
        <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-green-100">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider cursor-pointer" onClick={() => setSortAsc(s => !s)}>
                  Date {sortAsc ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />}
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-green-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-green-400">Loading...</td></tr>
              ) : sortedOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-green-400">No orders found</td></tr>
              ) : (
                sortedOrders.map(order => {
                  const statusObj = getStatusObj(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-green-50 transition">
                      <td className="px-6 py-4 font-mono text-green-900 font-bold">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-green-800">{order.buyer?.name}</div>
                        <div className="text-xs text-green-500">{order.buyer?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusObj.color} border border-green-100`}>
                          <statusObj.icon className="w-4 h-4" />
                          {statusObj.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-900">₹{order.total?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-green-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-green-200 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50 mr-2"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </button>
                        <div className="relative inline-block mr-2">
                          <button
                            className="inline-flex items-center px-3 py-2 border border-green-200 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"
                            onClick={() => setShowStatusDropdown(order._id === showStatusDropdown ? null : order._id)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Status
                          </button>
                          {showStatusDropdown === order._id && (
                            <div className="absolute z-10 mt-2 w-40 bg-white border border-green-200 rounded-lg shadow-lg">
                              {STATUS_OPTIONS.map(opt => (
                                <button
                                  key={opt.key}
                                  className={`w-full flex items-center gap-2 px-4 py-2 text-left text-green-800 hover:bg-green-50 ${order.status === opt.key ? 'font-bold bg-green-100' : ''}`}
                                  onClick={() => handleStatusChange(order, opt.key)}
                                >
                                  <opt.icon className="w-4 h-4" /> {opt.label}
                                </button>
                              ))}
            </div>
                          )}
          </div>
                        <button
                          className="inline-flex items-center px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                          onClick={() => setShowDeleteConfirm(order._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-red-700 mb-4">Delete Order?</h2>
            <p className="mb-6 text-green-800">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="flex-1 px-4 py-2 bg-gray-100 text-green-700 rounded-lg hover:bg-green-50"
                onClick={() => setShowDeleteConfirm(null)}
              >Cancel</button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => handleDeleteOrder(showDeleteConfirm)}
              >Delete</button>
            </div>
          </div>
                </div>
      )}
              </div>
  );
};

// --- Order Details Modal ---
const OrderDetailsModal = ({ order, onClose }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const steps = [
    { key: 'processing', label: 'Processing', icon: Clock },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Car },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    { key: 'cancelled', label: 'Cancelled', icon: XIcon },
  ];
  const currentStep = steps.findIndex(s => s.key === order.status);

  // Change status handler
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const { data } = await axios.put(`/api/v1/admin/orders/${order._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (data.success) {
        toast.success('Order status updated');
        socket.emit('order-status-update', data.updatedOrder);
        setConfirmStatus(null);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-green-100">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-green-900">Order Details</h2>
              <p className="text-xs text-green-500">{order.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-50 rounded-lg">
            <XIcon className="h-5 w-5 text-green-500" />
          </button>
                </div>
        <div className="p-6 space-y-6">
          {/* Timeline/Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                const isCancelled = order.status === 'cancelled' && step.key === 'cancelled';
                const canChange = !isActive && !isCancelled && idx > currentStep && step.key !== 'cancelled';
                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center flex-1 group">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer
                          ${isCancelled ? 'bg-red-100 border-red-400' :
                            isCompleted ? 'bg-green-100 border-green-400' :
                            isActive ? 'bg-green-50 border-green-500' :
                            canChange ? 'bg-white border-green-300 hover:bg-green-50 hover:border-green-500' :
                            'bg-gray-100 border-gray-200'}
                        `}
                        onClick={() => canChange && setConfirmStatus(step.key)}
                        title={canChange ? `Set status to ${step.label}` : ''}
                        style={{ opacity: canChange ? 1 : 0.7 }}
                      >
                        <Icon className={`w-5 h-5
                          ${isCancelled ? 'text-red-600' :
                            isCompleted ? 'text-green-600' :
                            isActive ? 'text-green-700' :
                            canChange ? 'text-green-500 group-hover:text-green-700' :
                            'text-gray-400'}
                        `} />
              </div>
                      <span className={`mt-2 text-xs font-medium
                        ${isCancelled ? 'text-red-600' :
                          isCompleted ? 'text-green-700' :
                          isActive ? 'text-green-700' :
                          canChange ? 'text-green-500 group-hover:text-green-700' :
                          'text-gray-500'}
                      `}>{step.label}</span>
                      {canChange && (
                        <span className="text-[10px] text-green-400 mt-1">Click to set</span>
                      )}
              </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-1 rounded-full
                        ${idx < currentStep ? 'bg-green-400' : 'bg-gray-200'}
                      `}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* Confirm status change modal */}
          {confirmStatus && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full border-t-4 border-green-500">
                <h2 className="text-xl font-bold text-green-700 mb-4">Change Status?</h2>
                <p className="mb-6 text-green-800">Are you sure you want to set status to <span className="font-bold">{steps.find(s => s.key === confirmStatus)?.label}</span>?</p>
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-4 py-2 bg-gray-100 text-green-700 rounded-lg hover:bg-green-50"
                    onClick={() => setConfirmStatus(null)}
                    disabled={updatingStatus}
                  >Cancel</button>
                  <button
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    onClick={() => handleStatusChange(confirmStatus)}
                    disabled={updatingStatus}
                  >{updatingStatus ? 'Updating...' : 'Change'}</button>
                </div>
              </div>
              </div>
          )}
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-900 mb-2">Customer</h3>
              <div className="text-green-800">{order.buyer?.name}</div>
              <div className="text-green-500 text-xs">{order.buyer?.email}</div>
            </div>
            <div>
              <h3 className="font-bold text-green-900 mb-2">Shipping Address</h3>
              <div className="text-green-800">{order.shippingAddress?.name}</div>
              <div className="text-green-500 text-xs">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}, {order.shippingAddress?.country}</div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-bold text-green-900 mb-2">Order Items</h3>
            <ul className="divide-y divide-green-50">
              {order.items?.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between items-center">
                  <span className="text-green-800">{item.name} x {item.quantity}</span>
                  <span className="font-bold text-green-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <span className="text-green-700 font-bold">Total:</span>
              <span className="text-green-900 font-black ml-2">₹{order.total?.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-green-700 font-bold">Status:</span>
              <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">{order.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;