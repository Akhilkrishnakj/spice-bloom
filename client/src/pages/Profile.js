import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  ShoppingBag, 
  Wallet, 
  Settings, 
  LogOut,
  Camera,
  Bell,
  Star,
  Coins,
  Shield,
  ChevronRight,
  Award,
  Gift,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Heart,
  Package,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: false,
    newsletter: true,
    security: true
  });

  const [userInfo, setUserInfo] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+91 9876543210',
    address: '123 Spice Garden, Kochi, Kerala, India',
    profilePic: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPic: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bio: 'Passionate about authentic spices and traditional cooking. Love exploring new flavors from around the world.',
    joinDate: 'January 2024'
  });

  const navigate = useNavigate();

  const handleOrderButton = () => {
    navigate('/my-orders');
  };

  const handleWalletButton = () => {
    navigate('/wallet');
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', userInfo);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const stats = [
    { label: 'Total Orders', value: '24', icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
    { label: 'Blooms Coins', value: '1,250', icon: Coins, color: 'from-yellow-500 to-yellow-600', bgColor: 'from-yellow-50 to-yellow-100' },
    { label: 'Wishlist Items', value: '18', icon: Heart, color: 'from-pink-500 to-pink-600', bgColor: 'from-pink-50 to-pink-100' },
    { label: 'Reviews Given', value: '12', icon: Star, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' }
  ];

  const renderProfileContent = () => (
    <div className="space-y-10">
      {/* Enhanced Stats Cards with Luxury Animations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 hover:border-gray-200 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-200/50 transform hover:-translate-y-2"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            
            {/* Floating Particles */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700"></div>
            <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse delay-300 transition-opacity duration-700"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-500">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl group-hover:scale-125 transition-all duration-500 transform group-hover:rotate-12`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
              
              {/* Progress Bar Animation */}
              <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 transform hover:-translate-y-1 hover:scale-105" onClick={handleOrderButton}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="relative flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-500">My Orders</h3>
              <p className="text-emerald-100 group-hover:text-white transition-colors duration-300">Track your spice deliveries</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Package size={32} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        </button>

        <button className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 transform hover:-translate-y-1 hover:scale-105" onClick={handleWalletButton}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping delay-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-500">My Wallet</h3>
              <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Manage your payments</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Wallet size={32} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        </button>
      </div>

      {/* Enhanced Personal Information */}
      <div className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 hover:border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700">
        <div className="relative p-10 border-b border-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-500">Personal Information</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Manage your account details and preferences</p>
            </div>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className="group/btn relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3">
                <div className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">
                  {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                </div>
                <span className="font-semibold">{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              {[
                { icon: User, label: 'Full Name', value: userInfo.name, key: 'name' },
                { icon: Mail, label: 'Email Address', value: userInfo.email, key: 'email' },
                { icon: Phone, label: 'Phone Number', value: userInfo.phone, key: 'phone' }
              ].map((field, index) => (
                <div key={field.key} className="group/field space-y-3" style={{ animationDelay: `${index * 100}ms` }}>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-3 group-hover/field:text-emerald-600 transition-colors duration-300">
                    <div className="p-2 bg-emerald-50 rounded-xl group-hover/field:bg-emerald-100 group-hover/field:scale-110 transition-all duration-300">
                      <field.icon size={16} className="text-emerald-600" />
                    </div>
                    {field.label}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                      value={field.value}
                      onChange={(e) => setUserInfo({...userInfo, [field.key]: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-500 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:bg-white focus:shadow-lg transform focus:scale-105"
                    />
                  ) : (
                    <div className="px-6 py-4 bg-gray-50/50 rounded-2xl text-gray-900 font-medium group-hover/field:bg-gray-100/80 group-hover/field:shadow-md transition-all duration-300 transform group-hover/field:scale-105">
                      {field.value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                { icon: MapPin, label: 'Address', value: userInfo.address, key: 'address', multiline: true },
                { icon: User, label: 'Bio', value: userInfo.bio, key: 'bio', multiline: true }
              ].map((field, index) => (
                <div key={field.key} className="group/field space-y-3" style={{ animationDelay: `${(index + 3) * 100}ms` }}>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-3 group-hover/field:text-emerald-600 transition-colors duration-300">
                    <div className="p-2 bg-emerald-50 rounded-xl group-hover/field:bg-emerald-100 group-hover/field:scale-110 transition-all duration-300">
                      <field.icon size={16} className="text-emerald-600" />
                    </div>
                    {field.label}
                  </label>
                  {isEditing ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => setUserInfo({...userInfo, [field.key]: e.target.value})}
                      rows={4}
                      placeholder={field.key === 'bio' ? 'Tell us about yourself...' : ''}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-500 text-gray-900 placeholder-gray-500 resize-none hover:bg-gray-50 focus:bg-white focus:shadow-lg transform focus:scale-105"
                    />
                  ) : (
                    <div className="px-6 py-4 bg-gray-50/50 rounded-2xl text-gray-900 font-medium min-h-[120px] flex items-center group-hover/field:bg-gray-100/80 group-hover/field:shadow-md transition-all duration-300 transform group-hover/field:scale-105">
                      {field.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-10">
      {/* Premium Features with Enhanced Animations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seller Program */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-3xl border border-emerald-200/50 hover:border-emerald-300/50 transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-300 rounded-full animate-ping delay-1000"></div>
          
          <div className="relative p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="p-5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-500">Become a Blooms Seller</h3>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors duration-300">Join our premium seller program</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-bold rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Start your journey as a premium spice seller and reach thousands of customers worldwide with our advanced seller tools.</p>
            <button className="group/btn w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl transition-all duration-500 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
              <span>Learn More</span>
              <ChevronRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Blooms Coins */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 rounded-3xl border border-yellow-200/50 hover:border-yellow-300/50 transition-all duration-700 hover:shadow-2xl hover:shadow-yellow-500/10 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-700"></div>
          
          <div className="relative p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="p-5 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Zap size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors duration-500">Blooms Coins</h3>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors duration-300">Earn rewards with every purchase</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 text-sm font-bold rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Collect coins with every order and redeem them for exclusive discounts, premium spices, and special offers.</p>
            <button className="group/btn w-full px-8 py-5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-500 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
              <span>Learn More</span>
              <ChevronRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Notifications */}
      <div className="group bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-100 hover:border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700">
        <div className="relative p-10 border-b border-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-4 group-hover:text-blue-600 transition-colors duration-500">
            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
              <Bell size={28} className="text-blue-600" />
            </div>
            Notification Preferences
          </h3>
          <p className="text-gray-600 mt-3 group-hover:text-gray-700 transition-colors duration-300">Customize how you want to receive updates and alerts</p>
        </div>
        <div className="p-10">
          <div className="space-y-8">
            {Object.entries(notifications).map(([key, value], index) => (
              <div key={key} className="group/item flex items-center justify-between p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-500 transform hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl group-hover/item:from-emerald-100 group-hover/item:to-green-100 group-hover/item:scale-110 transition-all duration-300">
                    <Bell size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg group-hover/item:text-emerald-600 transition-colors duration-300">
                      {key === 'orders' ? 'Order Updates' : 
                       key === 'promotions' ? 'Promotional Offers' : 
                       key === 'newsletter' ? 'Newsletter' : 'Security Alerts'}
                    </h4>
                    <p className="text-gray-600 mt-1 group-hover/item:text-gray-700 transition-colors duration-300">
                      {key === 'orders' ? 'Get notified about your order status and delivery updates' : 
                       key === 'promotions' ? 'Receive special offers, discounts, and seasonal deals' : 
                       key === 'newsletter' ? 'Weekly newsletter with recipes, tips, and spice guides' :
                       'Important security notifications and account alerts'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group-hover/item:scale-110 transition-transform duration-300">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-9 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/30 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-green-600 shadow-lg peer-checked:shadow-emerald-500/25"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Security & Privacy */}
      <div className="group bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-100 hover:border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700">
        <div className="relative p-10 border-b border-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-4 group-hover:text-red-600 transition-colors duration-500">
            <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
              <Shield size={28} className="text-red-600" />
            </div>
            Security & Privacy
          </h3>
          <p className="text-gray-600 mt-3 group-hover:text-gray-700 transition-colors duration-300">Manage your account security and privacy settings</p>
        </div>
        <div className="p-10">
          <div className="space-y-6">
            {[
              { icon: Lock, title: 'Change Password', desc: 'Update your account password for better security', action: 'Change', color: 'from-blue-500 to-blue-600' },
              { icon: Smartphone, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', action: 'Enable', color: 'from-green-500 to-green-600' },
              { icon: Eye, title: 'Privacy Settings', desc: 'Control who can see your profile and activity', action: 'Manage', color: 'from-purple-500 to-purple-600' },
              { icon: Globe, title: 'Data & Privacy', desc: 'Download your data or delete your account', action: 'View', color: 'from-orange-500 to-orange-600' }
            ].map((item, index) => (
              <button key={index} className="group/item w-full flex items-center justify-between p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-500 transform hover:scale-105 hover:shadow-lg" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-5">
                  <div className={`p-3 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg group-hover/item:shadow-xl group-hover/item:scale-110 transition-all duration-300`}>
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 text-lg group-hover/item:text-gray-800 transition-colors duration-300">{item.title}</div>
                    <div className="text-gray-600 mt-1 group-hover/item:text-gray-700 transition-colors duration-300">{item.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-emerald-600 font-bold group-hover/item:text-emerald-700 transition-colors duration-300">
                  <span>{item.action}</span>
                  <ChevronRight size={18} className="group-hover/item:translate-x-1 group-hover/item:scale-110 transition-all duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-green-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        {/* Cover Photo with Parallax Effect */}
        <div 
          className="h-96 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 relative transform transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.9)), url(${userInfo.coverPic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          
          {/* Floating Particles */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white/50 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-white/35 rounded-full animate-bounce delay-1500"></div>
          
          <button className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-md rounded-3xl hover:bg-white/30 transition-all duration-500 group shadow-2xl hover:shadow-white/10 transform hover:-translate-y-1 hover:scale-110">
            <Camera size={24} className="text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
          </button>
        </div>

        {/* Enhanced Profile Info */}
        <div className="relative -mt-24 px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end gap-10">
              <div className="relative group">
                <div className="w-48 h-48 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-2">
                  <img
                    src={userInfo.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <button className="absolute -bottom-3 -right-3 p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl hover:from-emerald-600 hover:to-green-700 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/25 group transform hover:-translate-y-1 hover:scale-110">
                  <Camera size={20} className="text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                </button>
              </div>
              
              <div className="flex-1 pb-10">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-1">
                  <h1 className="text-5xl font-bold text-gray-900 mb-4 hover:text-emerald-600 transition-colors duration-500">{userInfo.name}</h1>
                  <p className="text-gray-600 mb-6 text-xl leading-relaxed hover:text-gray-700 transition-colors duration-300">{userInfo.bio}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Premium Member
                    </span>
                    <span className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300">
                      Member since {userInfo.joinDate}
                    </span>
                    <span className="px-6 py-3 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-yellow-200 hover:scale-105 transition-all duration-300">
                      <Star size={16} className="fill-current animate-pulse" />
                      Verified Buyer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 z-50 mt-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex space-x-2 overflow-x-auto py-4">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-4 py-4 px-8 rounded-3xl whitespace-nowrap font-bold transition-all duration-500 transform hover:-translate-y-1 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-500/25 scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-lg hover:scale-105'
                }`}
              >
                <Icon size={20} className={activeTab === id ? 'animate-pulse' : ''} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        {activeTab === 'profile' && renderProfileContent()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Enhanced Floating Logout Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-red-500/30 transform hover:-translate-y-2 hover:scale-110"
        >
          <LogOut size={24} className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
          <span className="hidden sm:inline font-bold text-lg">Logout</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;