import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBlog, faPhone, faCartShopping, faUser, faUserShield ,faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';

const Header = () => {
  const cartItems = useSelector(state => state.cart);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [animate, setAnimate] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex justify-between items-center bg-green-50 border-b border-green-300 p-4 shadow-sm sticky top-0 z-50">
        <NavLink to="/" className="text-2xl font-bold text-green-700">Spice Bloom</NavLink>

        <ul className="flex gap-6">
          <li><NavLink to="/" className="text-green-700 hover:text-green-900">Home</NavLink></li>
          <li><NavLink to="/shop" className="text-green-700 hover:text-green-900">Shop</NavLink></li>
          <li><NavLink to="/blogs" className="text-green-700 hover:text-green-900">Blogs</NavLink></li>
          <li><NavLink to="/contact" className="text-green-700 hover:text-green-900">Contact</NavLink></li>
          {user?.role === 1 && (
            <>
              <li><NavLink to="/admin/dashboard" className="text-red-600 hover:text-red-800 font-semibold">Admin Dashboard</NavLink></li>
              <li><NavLink to="/admin/products" className="text-red-600 hover:text-red-800 font-semibold">Manage Products</NavLink></li>
            </>
          )}
        </ul>

        <div className="flex items-center gap-4">
          <NavLink to="/wishlist" className="text-pink-500 hover:text-pink-600">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </NavLink>

          <NavLink to="/cart" className="relative text-green-700 hover:text-green-900">
            <FontAwesomeIcon icon={faCartShopping} size="lg" />
            {totalItems > 0 && (
              <span className={`absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full px-1 ${animate ? 'animate-bounce' : ''}`}>
                {totalItems}
              </span>
            )}
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className="bg-green-600 text-white rounded-full px-3 py-1 text-sm">Login</NavLink>
              <NavLink to="/signup" className="border border-green-600 text-green-600 rounded-full px-3 py-1 text-sm">Signup</NavLink>
            </>
          ) : (
            <NavLink to="/profile" className="text-green-700 hover:text-green-900">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </NavLink>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-green-50 border-t border-green-300 flex justify-around items-center p-2 shadow-lg md:hidden">
        <NavLink to="/" className="text-green-700 hover:text-green-900">
          <FontAwesomeIcon icon={faHome} size="lg" />
        </NavLink>
        <NavLink to="/shop" className="text-green-700 hover:text-green-900">
          <FontAwesomeIcon icon={faStore} size="lg" />
        </NavLink>
        <NavLink to="/blogs" className="text-green-700 hover:text-green-900">
          <FontAwesomeIcon icon={faBlog} size="lg" />
        </NavLink>
        <NavLink to="/contact" className="text-green-700 hover:text-green-900">
          <FontAwesomeIcon icon={faPhone} size="lg" />
        </NavLink>
        <NavLink to="/cart" className="relative text-green-700 hover:text-green-900">
          <FontAwesomeIcon icon={faCartShopping} size="lg" />
          {totalItems > 0 && (
            <span className={`absolute -top-1 -right-2 bg-green-600 text-white text-xs rounded-full px-1 ${animate ? 'animate-bounce' : ''}`}>
              {totalItems}
            </span>
          )}
        </NavLink>
      </nav>

      {/* Optional Admin Quick Access Floating Button */}
      {user?.role === 1 && (
        <NavLink
          to="/admin/dashboard"
          className="fixed bottom-16 right-4 bg-red-600 text-white rounded-full p-3 shadow-lg md:hidden"
        >
          <FontAwesomeIcon icon={faUserShield} size="lg" />
        </NavLink>
      )}
    </>
  );
};

export default Header;
