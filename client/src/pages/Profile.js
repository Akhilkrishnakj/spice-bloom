import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, Edit3, Save, ShoppingBag, Wallet, LogOut, Bell, Shield, ChevronRight, Settings, TrendingUp, Camera, X, ArrowLeft, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, updateUserProfile, getUserStats } from '../api/user';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import FullPageLoader from '../components/FullPageLoader';
import MiniLoader from '../components/MiniLoader';


const DEFAULT_PROFILE_IMAGE = 'https://imgs.search.brave.com/d3lvpgl8vJsPCMoI_aQMaWe0MymkSAc4y9KtWcdp-rQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2l0ZW1zX2Jv/b3N0ZWQmdz03NDA';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Real user data from API
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: '',
    joinDate: '',
    bio: ''
  });

  const navigate = useNavigate();

  // Only show wallet as a stat, no orders or wishlist
  const [wallet, setWallet] = useState('₹0');

  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: false,
    newsletter: true,
    security: true,
  });

  // Fetch user data and stats on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user profile and wallet
      const [userData, statsData] = await Promise.all([
        getCurrentUser(),
        getUserStats()
      ]);

      setUserInfo({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        profilePic: userData.profilePic && userData.profilePic.trim() !== '' ? userData.profilePic : DEFAULT_PROFILE_IMAGE,
        joinDate: userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
          day: 'numeric' 
        }) : 'Recently',
        bio: userData.bio || ''
      });
      setWallet(`₹${statsData.walletBalance || 0}`);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updateData = {
        name: userInfo.name,
        phone: userInfo.phone,
        bio: userInfo.bio,
        profilePic: imagePreview !== null ? imagePreview : userInfo.profilePic || ''
      };

      await updateUserProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setImagePreview(null);
      setImageUploading(false);
      
      // Refresh data
      await fetchUserData();

    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  async function uploadToCloudinary(file) {
    const url = 'https://api.cloudinary.com/v1_1/dyup8ivlh/image/upload'; // TODO: Replace <your_cloud_name>
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'spice_bloom'); // TODO: Replace <your_unsigned_upload_preset>

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!data.secure_url) throw new Error('Cloudinary upload failed');
    return data.secure_url;
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUploading(true);
      setError('');

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        setImageUploading(false);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        setImageUploading(false);
        return;
      }

      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        setImagePreview(cloudinaryUrl); // Use the Cloudinary URL as preview
        setUserInfo((prev) => ({ ...prev, profilePic: cloudinaryUrl }));
        setImageUploading(false);
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        setImageUploading(false);
      }
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Layout>
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #e0fce6 0%, #fff 60%, #6ee7b7 100%)',
    }}>
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-green-200/15 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-bl from-teal-200/10 to-green-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(34,197,94) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb and Back Button Header */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <nav className="hidden sm:flex text-sm md:text-base text-emerald-500 font-medium items-center gap-1" aria-label="Breadcrumb">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
              <span className="mx-1 text-emerald-400">/</span>
              <span className="text-emerald-700 font-semibold">Profile</span>
            </nav>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="text-emerald-700 font-medium">{success}</div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-green-500/5 p-8 relative overflow-hidden">
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5 rounded-3xl"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
            
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl group-hover:scale-105 transition-all duration-500">
                  <img 
                    src={imagePreview || userInfo.profilePic || DEFAULT_PROFILE_IMAGE} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Image Upload Loading Overlay */}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <MiniLoader size={24} />
                        <span className="text-white text-xs font-medium">Processing...</span>
                    </div>
                    </div>
                  )}
                  
                  {/* Image Upload Overlay */}
                  {isEditing && !imageUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors duration-300"
                          title="Click to upload a new profile picture"
                        >
                          <Camera size={20} className="text-slate-700" />
                        </button>
                        <span className="text-white text-xs font-medium">Change Photo</span>
                        <span className="text-white/80 text-xs text-center px-2">Max 5MB</span>
                    </div>
                    </div>
                  )}
                </div>
                
                {/* Remove Image Button */}
                {isEditing && (userInfo.profilePic && userInfo.profilePic !== DEFAULT_PROFILE_IMAGE) && !imagePreview && (
                  <button
                    onClick={async () => {
                      setUserInfo({ ...userInfo, profilePic: '' });
                      setImagePreview(null);
                      setSaving(true);
                      setError('');
                      try {
                        await updateUserProfile({ ...userInfo, profilePic: '' });
                        await fetchUserData();
                        setSuccess('Profile image removed.');
                      } catch (err) {
                        setError('Failed to remove profile image.');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors duration-300 shadow-lg z-10"
                    title="Remove profile image"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
    </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mb-2 tracking-tight">
                    {userInfo.name || 'User'}
                  </h1>
                  <p className="text-slate-600 text-lg mb-3">{userInfo.email}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200/50">
                      Member since {userInfo.joinDate}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-teal-500/10 text-green-700 rounded-full text-sm font-semibold border border-green-200/50 flex items-center gap-1">
                      <Shield size={14} />
                      Verified
                    </span>
                </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
                  title="View My Orders"
                >
                  <ShoppingBag size={20} className="text-white group-hover:text-yellow-300 transition-colors" />
                  <span className="font-semibold hidden sm:inline">My Orders</span>
                </button>
                <button className="p-4 bg-white/80 hover:bg-white border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Bell size={20} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
                </button>
                <button className="p-4 bg-white/80 hover:bg-white border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Settings size={20} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Only Wallet */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-4 px-8 py-6 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:border-emerald-400"
            title="View Wallet"
          >
            <Wallet size={32} className="text-emerald-700" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-slate-700">Wallet Balance</span>
              <span className="text-3xl font-black text-emerald-700">{wallet}</span>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-2">
            <div className="flex gap-2">
              {['profile', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  {tab}
            </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-green-500/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <User size={24} />
                Personal Information
              </h2>
              <button
                onClick={isEditing ? handleSave : handleEdit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <MiniLoader size={18} />
                ) : isEditing ? (
                  <Save size={18} />
                ) : (
                  <Edit3 size={18} />
                )}
                {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-4 bg-white/80 border border-white/30 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-100 rounded-xl text-slate-800 font-medium">
                    {userInfo.name || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl text-slate-600 font-medium relative">
                  {userInfo.email}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full px-4 py-4 bg-white/80 border border-white/30 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="px-4 py-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-100 rounded-xl text-slate-800 font-medium">
                    {userInfo.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <User size={16} />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-4 bg-white/80 border border-white/30 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-300 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="px-4 py-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-100 rounded-xl text-slate-800 font-medium min-h-[80px] flex items-center">
                    {userInfo.bio || 'No bio provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Notifications Settings */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-green-500/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
              
              <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Bell size={24} />
                Notification Preferences
              </h2>

              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50/30 to-green-50/30 border border-emerald-100/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">
                        {key === 'orders' ? 'Order Updates' : 
                         key === 'promotions' ? 'Promotional Offers' : 
                         key === 'newsletter' ? 'Newsletter & Updates' : 
                         'Security Alerts'}
            </div>
                      <div className="text-sm text-slate-600">
                        {key === 'orders' ? 'Get notified about order status changes' : 
                         key === 'promotions' ? 'Receive exclusive deals and offers' : 
                         key === 'newsletter' ? 'Stay updated with our latest content' : 
                         'Important security and account notifications'}
        </div>
                  </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-green-600 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-300 peer-checked:after:translate-x-7 after:shadow-lg"></div>
                    </label>
                  </div>
            ))}
          </div>
        </div>

            {/* Premium Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blooms Coins */}
              <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-3xl shadow-2xl shadow-yellow-500/5 p-8 relative overflow-hidden hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-orange-400/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                      B
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Blooms Coins</h3>
                      <p className="text-sm text-slate-600">Loyalty Rewards Program</p>
      </div>
    </div>
                  <p className="text-slate-700 mb-6">Earn coins with every purchase and unlock exclusive rewards, discounts, and premium features.</p>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <Zap size={18} />
                    Coming Soon
          </button>
                </div>
              </div>
              
              {/* Blooms Seller */}
              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-3xl shadow-2xl shadow-emerald-500/5 p-8 relative overflow-hidden hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-transparent to-green-400/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Blooms Seller</h3>
                      <p className="text-sm text-slate-600">Premium Seller Program</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-6">Transform into a premium seller with advanced tools, analytics, and priority support to grow your business.</p>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <TrendingUp size={18} />
                    Coming Soon
                  </button>
          </div>
        </div>
      </div>

            {/* Logout Button */}
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="group px-12 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <LogOut size={20} />
                Logout Account
                <div className="w-0 group-hover:w-6 overflow-hidden transition-all duration-300">
                  <ChevronRight size={16} />
                </div>
              </button>
        </div>
      </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ProfilePage;