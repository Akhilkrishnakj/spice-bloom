import React from 'react';
import { X, User, Mail, Phone, MapPin, Package, Calendar, CreditCard, CheckCircle, Truck, Clock, X as XIcon } from 'lucide-react';
import { formatDate } from './utils/dataUtils';

const trackingSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out of Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  { key: 'cancelled', label: 'Cancelled', icon: XIcon },
];

const OrderDetailsModal = ({ order, onClose }) => {
  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Find the current step index
  const currentStepIndex = trackingSteps.findIndex(
    (step) => step.key.toLowerCase() === order.status?.toLowerCase()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-500">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Live Tracking Stepper */}
            <div className="mb-6">
              <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center gap-4">
                {trackingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  const isCancelled = order.status?.toLowerCase() === 'cancelled' && step.key === 'cancelled';
                  return (
                    <React.Fragment key={step.key}>
                      <div className={`flex flex-col items-center`}>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                          ${isCancelled ? 'bg-red-100 border-red-400' :
                            isCompleted ? 'bg-green-100 border-green-400' :
                            isActive ? 'bg-blue-100 border-blue-400' :
                            'bg-gray-100 border-gray-300'}
                        `}>
                          <Icon className={`w-5 h-5
                            ${isCancelled ? 'text-red-600' :
                              isCompleted ? 'text-green-600' :
                              isActive ? 'text-blue-600' :
                              'text-gray-400'}
                          `} />
                        </div>
                        <span className={`mt-2 text-xs font-medium
                          ${isCancelled ? 'text-red-600' :
                            isCompleted ? 'text-green-700' :
                            isActive ? 'text-blue-700' :
                            'text-gray-500'}
                        `}>{step.label}</span>
                      </div>
                      {idx < trackingSteps.length - 1 && (
                        <div className={`hidden md:block h-1 w-10 md:w-16 rounded-full
                          ${idx < currentStepIndex ? 'bg-green-400' : 'bg-gray-200'}
                        `}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            {/* Order Status & Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Order Date: {formatDate(order.orderDate)}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{order.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{order.phone}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <div className="text-gray-600 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
              </div>
              <div className="text-gray-600 space-y-1">
                <p>{order.billingAddress.street}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${(item.price / item.quantity).toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;