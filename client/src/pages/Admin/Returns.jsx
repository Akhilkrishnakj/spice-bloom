import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, CheckCircle, XCircle, Package, DollarSign, Clock, 
  Eye, Filter, RefreshCw, AlertCircle, Users, Calendar, MapPin
} from 'lucide-react';
import axios from 'axios';
import socket from '../../socket';
import toast from 'react-hot-toast';

const Returns = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showActionModal, setShowActionModal] = useState({ open: false, type: '', data: null });
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchReturnRequests();
    setupSocketListeners();
    
    return () => {
      socket.emit('leave-admin-room'); // <-- FIXED: leave room, don't disconnect socket
      // socket.disconnect(); // <-- REMOVE this line
    };
  }, []);

  const setupSocketListeners = () => {
    socket.connect();
    socket.emit('join-admin-room');
  };

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/admin/returns', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setReturnRequests(data.returnRequests || []);
    } catch (error) {
      console.error('Failed to fetch return requests:', error);
      toast.error('Failed to fetch return requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async (returnData) => {
    setProcessingAction(true);
    try {
      const { data } = await axios.post('/api/v1/admin/returns/approve', {
        orderId: returnData.orderId,
        itemIndex: returnData.itemIndex,
        returnShippingLabel: `RETURN-${returnData.orderNumber}-${returnData.itemIndex}`,
        notes: 'Return approved by admin'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (data.success) {
        toast.success('Return request approved');
        fetchReturnRequests();
        setShowActionModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      console.error('Error approving return:', error);
      toast.error('Failed to approve return request');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectReturn = async (returnData) => {
    setProcessingAction(true);
    try {
      const { data } = await axios.post('/api/v1/admin/returns/reject', {
        orderId: returnData.orderId,
        itemIndex: returnData.itemIndex,
        rejectionReason: 'Return request rejected by admin'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (data.success) {
        toast.success('Return request rejected');
        fetchReturnRequests();
        setShowActionModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      console.error('Error rejecting return:', error);
      toast.error('Failed to reject return request');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleProcessRefund = async (returnData) => {
    setProcessingAction(true);
    try {
      const { data } = await axios.post('/api/v1/admin/returns/process-refund', {
        orderId: returnData.orderId,
        itemIndex: returnData.itemIndex,
        refundMethod: 'Original Payment'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (data.success) {
        toast.success(`Refund of ₹${data.refundAmount} processed successfully`);
        fetchReturnRequests();
        setShowActionModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleMarkReturned = async (returnData) => {
    setProcessingAction(true);
    try {
      const { data } = await axios.post('/api/v1/admin/returns/mark-returned', {
        orderId: returnData.orderId,
        itemIndex: returnData.itemIndex,
        returnTrackingNumber: `RET-${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (data.success) {
        toast.success('Item marked as returned');
        fetchReturnRequests();
        setShowActionModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      console.error('Error marking item returned:', error);
      toast.error('Failed to mark item as returned');
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Requested': 'text-blue-600 bg-blue-100 border-blue-200',
      'Approved': 'text-green-600 bg-green-100 border-green-200',
      'Rejected': 'text-red-600 bg-red-100 border-red-200',
      'Returned': 'text-purple-600 bg-purple-100 border-purple-200',
      'Refunded': 'text-emerald-600 bg-emerald-100 border-emerald-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Requested': Clock,
      'Approved': CheckCircle,
      'Rejected': XCircle,
      'Returned': Package,
      'Refunded': DollarSign
    };
    return icons[status] || AlertCircle;
  };

  const filteredReturns = returnRequests.filter(ret => 
    filter === 'all' || ret.returnRequest.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RotateCcw className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Return Management</h1>
                  <p className="text-sm text-gray-500">Manage product returns and refunds</p>
                </div>
              </div>
              <button
                onClick={fetchReturnRequests}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {['all', 'Requested', 'Approved', 'Rejected', 'Returned', 'Refunded'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredReturns.length} return requests
            </div>
          </div>
        </div>
      </div>

      {/* Return Requests List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Return Requests</h2>
          </div>
          
          {filteredReturns.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No return requests</h3>
              <p className="text-gray-500">All return requests have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReturns.map((returnReq) => {
                const StatusIcon = getStatusIcon(returnReq.returnRequest.status);
                
                return (
                  <div key={`${returnReq.orderId}-${returnReq.itemIndex}`} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {returnReq.orderNumber}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(returnReq.returnRequest.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {returnReq.returnRequest.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{returnReq.buyer?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{returnReq.item.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {returnReq.returnRequest.requestedAt 
                                ? new Date(returnReq.returnRequest.requestedAt).toLocaleDateString()
                                : 'No date'
                              }
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-900">Return Reason: {returnReq.returnRequest.reason}</span>
                          </div>
                          {returnReq.returnRequest.description && (
                            <p className="text-sm text-gray-600">{returnReq.returnRequest.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        <button
                          onClick={() => setSelectedReturn(returnReq)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>

                        {returnReq.returnRequest.status === 'Requested' && (
                          <>
                            <button
                              onClick={() => setShowActionModal({ open: true, type: 'approve', data: returnReq })}
                              className="inline-flex items-center px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => setShowActionModal({ open: true, type: 'reject', data: returnReq })}
                              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </>
                        )}

                        {returnReq.returnRequest.status === 'Approved' && (
                          <button
                            onClick={() => setShowActionModal({ open: true, type: 'mark-returned', data: returnReq })}
                            className="inline-flex items-center px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Mark Returned
                          </button>
                        )}

                        {returnReq.returnRequest.status === 'Returned' && (
                          <button
                            onClick={() => setShowActionModal({ open: true, type: 'refund', data: returnReq })}
                            className="inline-flex items-center px-3 py-2 border border-emerald-300 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Process Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                {showActionModal.type === 'approve' && (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Approve Return Request?</h3>
                    <p className="text-gray-600">This will approve the return request and provide a shipping label.</p>
                  </>
                )}
                {showActionModal.type === 'reject' && (
                  <>
                    <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Return Request?</h3>
                    <p className="text-gray-600">This will reject the return request. The user will be notified.</p>
                  </>
                )}
                {showActionModal.type === 'mark-returned' && (
                  <>
                    <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mark Item as Returned?</h3>
                    <p className="text-gray-600">This will mark the item as returned and allow refund processing.</p>
                  </>
                )}
                {showActionModal.type === 'refund' && (
                  <>
                    <DollarSign className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Refund?</h3>
                    <p className="text-gray-600">This will process a full refund of ₹{(showActionModal.data.item.price * showActionModal.data.item.quantity).toFixed(2)}.</p>
                  </>
                )}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowActionModal({ open: false, type: '', data: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={processingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showActionModal.type === 'approve') handleApproveReturn(showActionModal.data);
                    else if (showActionModal.type === 'reject') handleRejectReturn(showActionModal.data);
                    else if (showActionModal.type === 'mark-returned') handleMarkReturned(showActionModal.data);
                    else if (showActionModal.type === 'refund') handleProcessRefund(showActionModal.data);
                  }}
                  disabled={processingAction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    showActionModal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    showActionModal.type === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    showActionModal.type === 'mark-returned' ? 'bg-purple-600 hover:bg-purple-700' :
                    'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {processingAction ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;