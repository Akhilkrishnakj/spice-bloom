import React, { useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../index.css'
import { useAuth } from '../context/AuthContext';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLocationDot, 
  faPen, 
  faShoppingBag, 
  faHeart, 
  faCog, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { clearCart } from '../redux/cartSlice';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const {logout} =  useAuth();
  const dispatch = useDispatch();
  
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Spice Market, Kerala, India',
    profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    coverPic: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1200'
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Add API call to save user info
  };

  const handleLogout = () => {
    dispatch(clearCart());
    logout();
    window.location.href = '/login';
  };

  const renderProfileContent = () => {
    return (
      <div className="profile-info-section">
        <div className="edit-button" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPen} />
          {isEditing ? ' Save' : ' Edit'}
        </div>
        
        <form onSubmit={handleSave}>
          <div className="info-group">
            <FontAwesomeIcon icon={faUser} />
            {isEditing ? (
              <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} />
            ) : (
              <span>{userInfo.name}</span>
            )}
          </div>

          <div className="info-group">
            <FontAwesomeIcon icon={faEnvelope} />
            {isEditing ? (
              <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
            ) : (
              <span>{userInfo.email}</span>
            )}
          </div>

          <div className="info-group">
            <FontAwesomeIcon icon={faPhone} />
            {isEditing ? (
              <input type="tel" value={userInfo.phone} onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} />
            ) : (
              <span>{userInfo.phone}</span>
            )}
          </div>

          <div className="info-group">
            <FontAwesomeIcon icon={faLocationDot} />
            {isEditing ? (
              <textarea value={userInfo.address} onChange={(e) => setUserInfo({...userInfo, address: e.target.value})} />
            ) : (
              <span>{userInfo.address}</span>
            )}
          </div>
        </form>
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <div className="orders-section">
        <h3>My Orders</h3>
        <p>No orders yet</p>
      </div>
    );
  };

  const renderWishlist = () => {
    return (
      <div className="wishlist-section">
        <h3>My Wishlist</h3>
        <p>Your wishlist is empty</p>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="settings-section">
        <h3>Settings</h3>
        <div className="settings-options">
          <div className="setting-item">
            <h4>Notifications</h4>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="setting-item">
            <h4>Email Updates</h4>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Profile - Spice Bloom">
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-photo" style={{ backgroundImage: `url(${userInfo.coverPic})` }}>
            <div className="profile-photo">
              <img src={userInfo.profilePic} alt="Profile" />
            </div>
          </div>
        </div>

        <div className="profile-nav">
          <div 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} /> Profile
          </div>
          <div 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FontAwesomeIcon icon={faShoppingBag} /> Orders
          </div>
          <div 
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <FontAwesomeIcon icon={faHeart} /> Wishlist
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FontAwesomeIcon icon={faCog} /> Settings
          </div>
          <div className="nav-item logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && renderProfileContent()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'wishlist' && renderWishlist()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
