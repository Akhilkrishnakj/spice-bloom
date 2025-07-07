import React from 'react';
import { Eye, Edit, Trash2, Calendar, User, Mail } from 'lucide-react';
import { formatDate } from './utils/dataUtils';

const OrderCard = ({ order, onView, onUpdateStatus, onDelete }) => {
  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {order.id}
            </h3>
            {getStatusBadge(order.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{order.customerName}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{order.customerEmail}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
              Ships to {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
          <button
            onClick={onView}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </button>
          
          <button
            onClick={onUpdateStatus}
            className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Status
          </button>
          
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;