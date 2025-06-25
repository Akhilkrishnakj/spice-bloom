import React, { useState, useEffect } from 'react';
import {
  Home, Package, ShoppingCart, Users, Percent, LogOut, Menu, X, Search,
  Bell, TrendingUp, Calendar, DollarSign, MoreHorizontal, Eye,
  Filter, Download, ChevronRight, Activity, ArrowUpRight, Settings,
  AlertCircle, RefreshCw
} from 'lucide-react';

// Custom gradient text component
const GradientText = ({ children, from, to }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${from} ${to}`}>
    {children}
  </span>
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
    <span className="text-red-700">{message}</span>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="ml-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
      >
        Retry
      </button>
    )}
  </div>
);

// API service functions
const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiService = {
  // Dashboard stats
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Recent orders
  async getRecentOrders(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/recent?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch recent orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // Sidebar data (badges, counts)
  async getSidebarData() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/sidebar`);
      if (!response.ok) throw new Error('Failed to fetch sidebar data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
      throw error;
    }
  },

  // User profile
  async getUserProfile() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async fetchUsers() {
    try {
      const res = await fetch("/api/v1/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        console.log("Users:", data.users); // ✅ replace this with setState if using React
      } else {
        console.error("Failed to load users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }
};

function App() {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [sidebarData, setSidebarData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar links configuration
  const sidebarLinks = [
    { title: 'Dashboard', icon: Home, path: '/admin/dashboard', key: 'dashboard' },
    { title: 'Products', icon: Package, path: '/admin/products-manage', key: 'products' },
    { title: 'Orders', icon: ShoppingCart, path: '/admin/orders', key: 'orders' },
    { title: 'Users', icon: Users, path: '/admin/users', key: 'users' },
    { title: 'Offers', icon: Percent, path: '/admin/offers', key: 'offers' },
    { title: 'Settings', icon: Settings, path: '/admin/settings', key: 'settings' }
  ];

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, ordersData, sidebarInfo, userInfo, notificationsData] = await Promise.all([
        apiService.getStats(),
        apiService.getRecentOrders(),
        apiService.getSidebarData(),
        apiService.getUserProfile(),
        apiService.getNotifications()
      ]);
      
      setStats(statsData);
      setRecentOrders(ordersData);
      setSidebarData(sidebarInfo);
      setUserProfile(userInfo);
      setNotifications(notificationsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API if available
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
    // You can call an API or filter existing data
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/dashboard/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (loading && !stats.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !stats.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 w-72 h-screen bg-white border-r border-gray-200 shadow-xl lg:shadow-sm transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
        
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex justify-center items-center text-white shadow">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-green-800">Spice Mart</p>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button 
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto h-[calc(100vh-180px)]">
          {sidebarLinks.map(link => (
            <a 
              href={link.path} 
              key={link.title}
              className="flex items-center justify-between p-3 mb-1 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 group text-sm lg:text-base"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-md bg-gray-50 group-hover:bg-white group-hover:shadow-sm">
                  <link.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-medium">{link.title}</span>
              </div>
              <div className="flex items-center space-x-1">
                {sidebarData[link.key] && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {sidebarData[link.key]}
                  </span>
                )}
              </div>
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100 bg-white">
          <button 
            className="flex items-center w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors duration-200" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 gap-3 sm:gap-0">
            <div className="flex items-center">
              <button 
                className="lg:hidden p-2 mr-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative w-full sm:max-w-md sm:ml-4 mt-2 sm:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 bg-white" 
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-500" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm cursor-pointer hover:bg-gray-300 transition-colors duration-200">
                <span>{userProfile?.initials || 'AD'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-5 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button className="px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1.5 w-full sm:w-auto justify-center">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
              <button 
                onClick={handleExport}
                className="px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1.5 w-full sm:w-auto justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.id || index} 
                className="group bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-transparent transition-all duration-200 hover:-translate-y-0.5 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 ${stat.lightColor || 'bg-gray-50'} rounded-xl shadow-inner`}>
                      {stat.icon ? (
                        <stat.icon className={`${stat.iconColor || 'text-gray-600'} w-5 h-5`} />
                      ) : (
                        <Activity className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <span className="text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.trend || '+0%'}
                    </span>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md mt-4 sm:mt-0">
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Latest transactions from your store</p>
            </div>
            
            {loading && !recentOrders.length ? (
              <LoadingSpinner />
            ) : error && !recentOrders.length ? (
              <ErrorMessage message="Failed to load recent orders" onRetry={fetchData} />
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="bg-white hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="font-mono">{order.orderNumber || order.id}</span>
                        </td>
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs shadow-sm">
                              {order.customer?.initials || order.customer?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'Unknown'}</div>
                              {order.customer?.email && (
                                <div className="text-xs text-gray-500">{order.customer.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.total}
                        </td>
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                            <span>{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                            <button 
                              onClick={() => window.location.href = `/admin/orders/${order.id}`}
                              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors duration-200">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Table Footer */}
            {recentOrders.length > 0 && (
              <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 border-t border-gray-100">
                <div className="text-xs sm:text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{recentOrders.length}</span> of{' '}
                  <span className="font-medium">{recentOrders.length}</span> results
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button 
                    disabled
                    className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border bg-white text-gray-400 cursor-not-allowed w-1/2 sm:w-auto text-center"
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 w-1/2 sm:w-auto text-center">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


export default App;