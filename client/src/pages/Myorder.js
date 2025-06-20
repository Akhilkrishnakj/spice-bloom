import React, { useState } from 'react';
import { Search, Filter, Package, Truck, CheckCircle, Clock, X, ChevronDown, ChevronUp, RotateCcw, Phone, Star, Download, Eye, Calendar, MapPin, CreditCard, FileText, ShoppingBag } from 'lucide-react';

const mockOrders = [
  {
    id: '1',
    orderNumber: 'SB-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    subtotal: 79.97,
    shipping: 7.99,
    tax: 2.01,
    total: 89.97,
    trackingNumber: 'TB123456789',
    deliveredDate: '2024-01-18',
    shippingAddress: {
      name: 'John Smith',
      street: '123 Culinary Lane',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    paymentMethod: 'Visa ending in 4242',
    items: [
      { 
        id: '1', 
        name: 'Organic Turmeric Powder', 
        quantity: 2, 
        price: 12.99, 
        image: 'https://images.pexels.com/photos/4198731/pexels-photo-4198731.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Premium organic turmeric powder sourced from the finest farms. Rich in curcumin with anti-inflammatory properties. Perfect for curries, golden milk, and health supplements.',
        weight: '100g per pack',
        origin: 'Kerala, India',
        category: 'Ground Spices'
      },
      { 
        id: '2', 
        name: 'Premium Saffron Threads', 
        quantity: 1, 
        price: 49.99, 
        image: 'https://images.pexels.com/photos/4750271/pexels-photo-4750271.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Authentic Kashmir saffron threads, hand-picked at dawn for maximum potency. Grade A quality with intense aroma and deep color. A little goes a long way.',
        weight: '2g',
        origin: 'Kashmir, India',
        category: 'Premium Spices'
      },
      { 
        id: '3', 
        name: 'Whole Black Peppercorns', 
        quantity: 3, 
        price: 8.99, 
        image: 'https://images.pexels.com/photos/4198739/pexels-photo-4198739.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Freshly harvested black peppercorns with bold, pungent flavor. Perfect for grinding fresh or using whole in marinades and slow-cooked dishes.',
        weight: '50g per pack',
        origin: 'Malabar Coast, India',
        category: 'Whole Spices'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'SB-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    subtotal: 142.96,
    shipping: 9.99,
    tax: 3.50,
    total: 156.45,
    trackingNumber: 'TB987654321',
    estimatedDelivery: '2024-01-25',
    shippingAddress: {
      name: 'Sarah Johnson',
      street: '456 Spice Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'Mastercard ending in 8888',
    items: [
      { 
        id: '4', 
        name: 'Himalayan Pink Salt', 
        quantity: 2, 
        price: 15.99, 
        image: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Pure Himalayan pink salt crystals, mined from ancient sea beds. Rich in minerals with a subtle, complex flavor that enhances any dish.',
        weight: '250g per pack',
        origin: 'Punjab, Pakistan',
        category: 'Salts'
      },
      { 
        id: '5', 
        name: 'Cardamom Pods (Green)', 
        quantity: 4, 
        price: 18.99, 
        image: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Fresh green cardamom pods with intense aromatic oils. Essential for Indian desserts, chai, and Middle Eastern cuisine. Hand-selected for quality.',
        weight: '25g per pack',
        origin: 'Western Ghats, India',
        category: 'Pods & Seeds'
      },
      { 
        id: '6', 
        name: 'Cinnamon Sticks (Ceylon)', 
        quantity: 1, 
        price: 22.99, 
        image: 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'True Ceylon cinnamon sticks with delicate, sweet flavor. Superior to cassia with lower coumarin content. Perfect for baking and beverages.',
        weight: '50g',
        origin: 'Sri Lanka',
        category: 'Bark Spices'
      },
      { 
        id: '7', 
        name: 'Star Anise Whole', 
        quantity: 2, 
        price: 16.99, 
        image: 'https://images.pexels.com/photos/4198732/pexels-photo-4198732.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Whole star anise pods with licorice-like flavor. Essential for Asian cuisine, mulled wines, and spice blends. Beautiful star-shaped presentation.',
        weight: '30g per pack',
        origin: 'Guangxi, China',
        category: 'Whole Spices'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'SB-2024-003',
    date: '2024-01-22',
    status: 'processing',
    subtotal: 61.95,
    shipping: 5.99,
    tax: 0.00,
    total: 67.94,
    shippingAddress: {
      name: 'Michael Chen',
      street: '789 Flavor Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'United States'
    },
    paymentMethod: 'American Express ending in 1234',
    items: [
      { 
        id: '8', 
        name: 'Smoked Paprika Powder', 
        quantity: 3, 
        price: 11.99, 
        image: 'https://images.pexels.com/photos/4198733/pexels-photo-4198733.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Authentic Spanish smoked paprika (Pimentón de la Vera) with deep, smoky flavor. Adds complexity to meats, vegetables, and rice dishes.',
        weight: '75g per pack',
        origin: 'Extremadura, Spain',
        category: 'Ground Spices'
      },
      { 
        id: '9', 
        name: 'Fennel Seeds Whole', 
        quantity: 2, 
        price: 9.99, 
        image: 'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Sweet, aromatic fennel seeds with anise-like flavor. Perfect for Italian sausages, Indian cuisine, and digestive teas. Premium quality seeds.',
        weight: '40g per pack',
        origin: 'Rajasthan, India',
        category: 'Seeds'
      },
      { 
        id: '10', 
        name: 'Cumin Seeds (Whole)', 
        quantity: 4, 
        price: 7.99, 
        image: 'https://images.pexels.com/photos/4198735/pexels-photo-4198735.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Earthy, warm cumin seeds essential for Middle Eastern and Mexican cuisine. Toast before grinding for maximum flavor release.',
        weight: '60g per pack',
        origin: 'Gujarat, India',
        category: 'Seeds'
      }
    ]
  }
];

const statusConfig = {
  processing: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Delivered' },
  cancelled: { icon: X, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' }
};

function App() {
  const [orders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.color} ${config.border}`}>
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  const ProductModal = ({ item, order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
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
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <RotateCcw className="w-4 h-4" />
              Reorder This Item
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
              <ShoppingBag className="w-4 h-4" />
              View Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Spice<span className="text-green-600">Bloom</span>
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
          <p className="text-gray-600">Track and manage your spice orders</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'all' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Orders
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                              className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Invoice
                            </button>
                          )}
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
                            className="w-12 h-12 rounded-lg border-2 border-white object-cover hover:scale-110 transition-transform cursor-pointer"
                          />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.name}
                          </div>
                        </button>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-6">
                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
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
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                              <button
                                onClick={() => setSelectedProduct({ item, order })}
                                className="flex-shrink-0 group relative"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-black bg-opacity-50 rounded-lg p-2">
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
                        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
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
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-gray-900">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>Paid with {order.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                            Reorder
                          </button>
                          {order.status === 'delivered' && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                <Star className="w-4 h-4" />
                                Leave Review
                              </button>
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download Invoice
                              </button>
                            </>
                          )}
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4" />
                            Contact Support
                          </button>
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