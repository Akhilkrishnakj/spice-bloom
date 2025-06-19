import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, Eye, Edit, Trash2, Calendar } from 'lucide-react';
 import { mockOrders } from './mockOrders';
import { formatDate, isDateInRange } from './utils/dataUtils';
import OrderDetailsModal from './OrderDetailsModel';
import StatusUpdateModal from './StatusUpdateModel';
import DeleteConfirmModal from './DeleteConfirmModel';
import OrderCard from './OrderCard';
import FilterBar from './FilterBar';


console.log('mockOrders at load:', mockOrders);


const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
                           order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                           order.customerEmail.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || order.status === filters.status;
      
      const matchesDate = isDateInRange(order.orderDate, filters.startDate, filters.endDate);
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, filters]);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setStatusUpdateOrder(null);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    setDeleteOrder(null);
  };

  const getStatusStats = () => {
    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-sm text-gray-500">Manage and track all customer orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => setSelectedOrder(order)}
                  onUpdateStatus={() => setStatusUpdateOrder(order)}
                  onDelete={() => setDeleteOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {statusUpdateOrder && (
        <StatusUpdateModal
          order={statusUpdateOrder}
          onUpdate={handleUpdateStatus}
          onClose={() => setStatusUpdateOrder(null)}
        />
      )}

      {deleteOrder && (
        <DeleteConfirmModal
          order={deleteOrder}
          onDelete={handleDeleteOrder}
          onClose={() => setDeleteOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;