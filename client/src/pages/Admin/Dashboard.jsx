import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, Package, ShoppingCart, Users, Percent, LogOut, Menu, X,
  Calendar as CalendarIcon, Settings, AlertCircle, RefreshCw, User
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReactApexChart from 'react-apexcharts';
import { ResponsiveContainer } from 'recharts';


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
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://spice-bloom-api.onrender.com/api';

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
      const response = await fetch(`${API_BASE_URL}/user/me`, {
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
      const res = await fetch(`${API_BASE_URL}/admin`, {
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
  },

  async getSalesTrend(period = 'week') {
    const response = await fetch(`${API_BASE_URL}/dashboard/sales-trend?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch sales trend');
    return await response.json();
  },

  async getNewUsersTrend(period = 'week') {
    const response = await fetch(`${API_BASE_URL}/dashboard/new-users-trend?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch new users trend');
    return await response.json();
  },
};

function App() {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [period, setPeriod] = useState('week');
  const [newUsersPeriod, setNewUsersPeriod] = useState('week');
  const [newUsersTrend, setNewUsersTrend] = useState([]);

  // Sidebar links configuration
  const sidebarLinks = [
    { title: 'Dashboard', icon: Home, key: 'dashboard', path: '/admin/dashboard' },
    { title: 'Products', icon: Package, key: 'products', path: '/admin/products-manage' },
    { title: 'Users', icon: Users, key: 'users', path: '/admin/users' },
    { title: 'Orders', icon: ShoppingCart, key: 'orders', path: '/admin/orders' },
    { title: 'Offers', icon: Percent, key: 'offers', path: '/admin/offers' },
    { title: 'Settings', icon: Settings, key: 'settings', path: '/admin/settings' },
  ];

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, ordersData] = await Promise.all([
        apiService.getStats(),
        apiService.getRecentOrders()
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fetch sales trend data
  const fetchSalesTrend = useCallback(async () => {
    try {
      let url = `${API_BASE_URL}/dashboard/sales-trend?period=${period}`;
      if (selectedDate && period === 'day') {
        url += `&date=${selectedDate}`;
      }
      const data = await fetch(url).then(res => res.json());
      setSalesTrendData(data);
    } catch (err) {
      setSalesTrendData([]);
    }
  }, [period, selectedDate]);

  useEffect(() => {
    fetchSalesTrend();
    const interval = setInterval(fetchSalesTrend, 15000);
    return () => clearInterval(interval);
  }, [period, selectedDate, fetchSalesTrend]);

  // Debug: log the data being passed to the chart
  useEffect(() => {
    console.log('Sales Trend Data:', salesTrendData);
  }, [salesTrendData]);

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

  // --- Calendar click handler ---
  const handleCalendarChange = (date) => {
    const iso = date.toISOString().slice(0, 10);
    setSelectedDate(iso);
    setPeriod('day');
    setNewUsersPeriod('day');
  };

  // When period changes away from 'day', clear selectedDate
  useEffect(() => {
    if (period !== 'day' && selectedDate) setSelectedDate(null);
  }, [period]);
  useEffect(() => {
    if (newUsersPeriod !== 'day' && selectedDate) setSelectedDate(null);
  }, [newUsersPeriod]);

  // Prepare data for ApexCharts
  const salesData = salesTrendData && salesTrendData.length > 0 ? salesTrendData : [];

  // Extract series and categories
  const series = [{
    name: "Sales",
    data: salesData.map(d => d.sales)
  }];
  const categories = salesData.map(d => d.date);

  // Determine line color: green if up, red if down
  const getLineColor = () => {
    if (series[0].data.length < 2) return "#10B981"; // default green
    return series[0].data[series[0].data.length - 1] >= series[0].data[series[0].data.length - 2]
      ? "#10B981" // green
      : "#EF4444"; // red
  };

  // Latest value for horizontal line
  const latestValue = series[0].data[series[0].data.length - 1];

  // ApexCharts options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 220,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    stroke: {
      curve: 'smooth',
      width: 4,
      colors: [getLineColor()],
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#4B0082", fontWeight: 600 } }
    },
    yaxis: {
      labels: { style: { colors: "#10B981", fontWeight: 600 } }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: val => `₹${val}` }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    markers: {
      size: 6,
      colors: [getLineColor()],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 8 }
    },
    annotations: {
      yaxis: latestValue !== undefined ? [
        {
          y: latestValue,
          borderColor: '#EF4444',
          label: {
            borderColor: '#EF4444',
            style: { color: '#fff', background: '#EF4444' },
            text: `Latest: ₹${latestValue}`,
          }
        }
      ] : []
    }
  };

  const fetchNewUsersTrend = async () => {
    try {
      let url = `${API_BASE_URL}/dashboard/new-users-trend?period=${newUsersPeriod}`;
      if (selectedDate && newUsersPeriod === 'day') {
        url += `&date=${selectedDate}`;
      }
      const data = await fetch(url).then(res => res.json());
      setNewUsersTrend(data);
    } catch (err) {
      setNewUsersTrend([]);
    }
  };

  useEffect(() => {
    fetchNewUsersTrend();
    const interval = setInterval(fetchNewUsersTrend, 15000);
    return () => clearInterval(interval);
  }, [newUsersPeriod, selectedDate, fetchNewUsersTrend]);

  // ECG-style ApexChart for new users
  const newUsersSeries = [{
    name: 'New Users',
    data: newUsersTrend.map(d => d.count)
  }];
  const newUsersCategories = newUsersTrend.map(d => d.date);
  const newUsersChartOptions = {
    chart: {
      type: 'line',
      height: 120,
      sparkline: { enabled: true },
      animations: { enabled: true, easing: 'linear', speed: 900 },
    },
    stroke: {
      curve: 'stepline', // ECG/jagged look
      width: 3,
      colors: ['#10B981'],
    },
    xaxis: {
      categories: newUsersCategories,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: { formatter: val => `${val} users` }
    },
    grid: {
      show: false,
    },
    markers: {
      size: 4,
      colors: ['#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 6 }
    },
  };

  // --- Status badge color ---
  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-indigo-100 text-indigo-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`fixed z-40 lg:static w-64 h-full bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">Spice Bloom </span>
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
        </div>
        <nav className="flex-1 p-2">
          {sidebarLinks.map(link => (
            <a
              key={link.key}
              href={link.path}
              onClick={() => setActiveNav(link.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-all duration-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 ${activeNav === link.key ? 'bg-gradient-to-r from-emerald-100 to-indigo-100 text-emerald-700 shadow' : ''}`}
            >
              <link.icon className={`w-5 h-5 ${activeNav === link.key ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>{link.title}</span>
            </a>
          ))}
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg mt-6 font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-gray-400" /> Logout
          </button>
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-md hover:bg-emerald-50" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6 text-emerald-600" /></button>
            <h1 className="text-xl font-bold text-emerald-700 tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-gray-600 font-medium">{selectedDate ? selectedDate : new Date().toLocaleDateString()}</span>
            <User className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 p-1" />
          </div>
        </header>
        {/* Main Grid */}
        <main className="flex-1 p-4 md:p-8 bg-white/90">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Chart (large) */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-emerald-700">Sales Growth</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="day">Daily</option>
                  </select>
                  {selectedDate && period === 'day' && (
                    <span className="text-xs text-emerald-700 font-semibold">{selectedDate}</span>
                  )}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ReactApexChart
                  options={chartOptions}
                  series={series}
                  type="line"
                  height={220}
                />
              </ResponsiveContainer>
            </div>
            {/* New Users Chart (ECG style) */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-emerald-700">New Users</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={newUsersPeriod}
                    onChange={e => setNewUsersPeriod(e.target.value)}
                    className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="day">Daily</option>
                  </select>
                  {selectedDate && newUsersPeriod === 'day' && (
                    <span className="text-xs text-emerald-700 font-semibold">{selectedDate}</span>
                  )}
                </div>
              </div>
              {newUsersTrend.length > 0 ? (
                <ReactApexChart
                  options={newUsersChartOptions}
                  series={newUsersSeries}
                  type="line"
                  height={120}
                />
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-400 text-sm">No data available</div>
              )}
            </div>
          </div>
          {/* Calendar & Recent Orders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col items-center">
              <h2 className="text-lg font-bold text-emerald-700 mb-4">Calendar</h2>
              <Calendar
                onChange={handleCalendarChange}
                value={selectedDate ? new Date(selectedDate) : new Date()}
                className="rounded-xl border-emerald-200 shadow"
                tileClassName={({ date, view }) =>
                  view === 'month' && date.toISOString().slice(0, 10) === selectedDate
                    ? 'bg-emerald-100 text-emerald-700 font-bold' : ''
                }
              />
              <div className="mt-4 w-full text-center">
                <span className="text-sm text-gray-600">{selectedDate ? `Selected: ${selectedDate}` : `Today: ${new Date().toLocaleDateString()}`}</span>
              </div>
            </div>
            {/* Recent Orders Table */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-emerald-700">Recent Orders</h2>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-emerald-600 hover:to-indigo-700 transition"
                  onClick={() => window.location.href = '/admin/orders'}
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="p-3 text-left font-semibold text-emerald-700">Order</th>
                      <th className="p-3 text-left font-semibold text-emerald-700">Customer</th>
                      <th className="p-3 text-left font-semibold text-emerald-700">Total</th>
                      <th className="p-3 text-left font-semibold text-emerald-700">Status</th>
                      <th className="p-3 text-left font-semibold text-emerald-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order) => (
                      <tr key={order._id || order.id} className="border-b last:border-b-0 hover:bg-emerald-50/40 transition">
                        <td className="p-3 font-mono">{order._id || order.id}</td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold">{order.customer?.name || order.customer}</div>
                            {order.customer?.email && (
                              <div className="text-xs text-gray-500">{order.customer.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-emerald-700">₹{order.total}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;