import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Store, 
  BookOpen, 
  Phone, 
  ShoppingCart, 
  User, 
  Shield,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';

const Header = () => {
  const cartItems = useSelector(state => state.cart);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [animate, setAnimate] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Store },
    { to: '/blogs', label: 'Blogs', icon: BookOpen },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      {/* Desktop nav */}
      <nav className={`hidden md:flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 shadow-lg py-3' 
          : 'bg-white/95 backdrop-blur-lg border-b border-emerald-100/30 py-4'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <NavLink 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
          >
            Spice Bloom
          </NavLink>

          <div className="flex items-center space-x-8">
            {navigationItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActive ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`
                }
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}

            {user?.role === 1 && (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                <NavLink
                  to="/admin/dashboard"
                  className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors duration-200"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/products"
                  className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors duration-200"
                >
                 Add Products
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <NavLink to="/wishlist" className="relative p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-300 group">
              <Heart className="h-5 w-5" />
              <span className="absolute inset-0 rounded-full bg-rose-100 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </NavLink>

            <NavLink to="/cart" className="relative p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-300 group">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-medium rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center shadow-lg ${animate ? 'animate-bounce' : ''}`}>
                  {totalItems}
                </span>
              )}
              <span className="absolute inset-0 rounded-full bg-emerald-100 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </NavLink>

            {!user ? (
              <div className="flex items-center space-x-3">
                <NavLink to="/login">
                  <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm rounded px-3 py-1 transition-all duration-300">Login</button>
                </NavLink>
                <NavLink to="/signup">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-300">Sign Up</button>
                </NavLink>
              </div>
            ) : (
              <NavLink to="/profile" className="relative p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-300 group">
                <User className="h-5 w-5" />
                <span className="absolute inset-0 rounded-full bg-emerald-100 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl md:hidden">
        <div className="grid grid-cols-5 py-2">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 ${
                  isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
                }`
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-300 ${
                isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`
            }
          >
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Cart</span>
            {totalItems > 0 && (
              <span className={`absolute top-0 right-2 bg-emerald-600 text-white text-xs font-medium rounded-full px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center shadow-lg ${animate ? 'animate-bounce' : ''}`}>
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Admin FAB */}
      {user?.role === 1 && (
        <NavLink to="/admin/dashboard" className="fixed bottom-20 right-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 md:hidden group">
          <Shield className="h-6 w-6" />
          <span className="absolute -top-2 -left-2 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
          <span className="absolute -top-2 -left-2 w-3 h-3 bg-rose-500 rounded-full" />
        </NavLink>
      )}

      <div className="h-16 md:h-20" />
    </>
  );
};

export default Header;
