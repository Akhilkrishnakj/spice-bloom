import React, { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBox,
  faShoppingCart,
  faUsers,
  faPercent,
  faSignOutAlt,
  faBars,
  faTimes,
  faSearch,
  faBell,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layouts/Layout';
import './Admin.css';
import axios from 'axios';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();  // useNavigate hook to navigate programmatically

  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/admin/dashboard')
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error(err);
        setMessage("Error loading dashboard");
      });
  }, []);
     
  console.log('resndering dashboard.....!')

  const stats = [
    { title: 'Total Users', value: '1,234', icon: faUsers, trend: '+12.5%', color: 'blue' },
    { title: 'Total Products', value: '456', icon: faBox, trend: '+5.2%', color: 'purple' },
    { title: 'Total Orders', value: '789', icon: faShoppingCart, trend: '+18.7%', color: 'green' },
    { title: 'Total Revenue', value: '$12,345', icon: faChartLine, trend: '+25.3%', color: 'orange' },
  ];

  const recentOrders = [
    { id: '#123', user: 'John Doe', status: 'Completed', total: '$99.99', date: '2025-04-13' },
    { id: '#124', user: 'Jane Smith', status: 'Pending', total: '$149.99', date: '2025-04-13' },
    { id: '#125', user: 'Mike Johnson', status: 'Processing', total: '$79.99', date: '2025-04-12' },
    { id: '#126', user: 'Sarah Wilson', status: 'Completed', total: '$199.99', date: '2025-04-12' },
  ];

  const sidebarLinks = [
    { title: 'Dashboard', icon: faHome, path: '/admin/dashboard' },
    { title: 'Products', icon: faBox, path: '/admin/products' },
    { title: 'Orders', icon: faShoppingCart, path: '/admin/orders' },
    { title: 'Users', icon: faUsers, path: '/admin/users' },
    { title: 'Offers', icon: faPercent, path: '/admin/offers' },
    { title: 'Logout', icon: faSignOutAlt, path: '/logout' },
  ];

  const goToProducts = () => {
    navigate('/admin/products');  // Navigate to the Products page programmatically
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-container">
              <h1 className="text-xl font-bold text-white">Spice Mart</h1>
              <span className="text-sm text-gray-400">Admin Panel</span>
            </div>
            <button
              className="lg:hidden text-white hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="sidebar-icon" />
            </button>
          </div>
          <div className="sidebar-search">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input type="text" placeholder="Quick search..." className="search-input" />
            </div>
          </div>
          <nav className="sidebar-nav">
            {sidebarLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="sidebar-link"
              >
                <FontAwesomeIcon icon={link.icon} className="sidebar-icon" />
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Header */}
          <header className="admin-header">
            <div className="header-left">
              <button
                className="lg:hidden menu-button"
                onClick={() => setSidebarOpen(true)}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <div className="header-search">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
            </div>
            <div className="header-right">
              <button className="notification-button">
                <FontAwesomeIcon icon={faBell} />
                <span className="notification-badge">3</span>
              </button>
              <div className="admin-profile">
                <span className="admin-name">Admin User</span>
                <div className="admin-avatar">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="welcome-section">
              <div>
                <h1 className="welcome-title">Welcome back, Admin</h1>
                <p className="welcome-subtitle">Here's what's happening with your store today.</p>
              </div>
              <button className="export-button">
                Export Report
              </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`stat-card stat-${stat.color}`}
                  style={{ '--animation-order': index }}
                >
                  <div className="stat-content">
                    <div className="stat-header">
                      <h3 className="stat-title">{stat.title}</h3>
                      <div className={`trend-badge trend-up`}>
                        {stat.trend}
                      </div>
                    </div>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div className="stat-icon-container">
                    <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="orders-container">
              <div className="orders-header">
                <h2 className="orders-title">Recent Orders</h2>
                <button className="view-all-button">View All</button>
              </div>
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.total}</td>
                        <td>{order.date}</td>
                        <td>
                          <button className="action-button">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Button to navigate to Products */}
          <button onClick={goToProducts} className="go-to-products-button">
            Go to Products
          </button>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
