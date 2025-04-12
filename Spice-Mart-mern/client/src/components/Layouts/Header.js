import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,faHeart,faUser } from '@fortawesome/free-solid-svg-icons';

import './Header.css';

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid">
          <NavLink className="navbar-brand fw-bold text-success" to="/">
            Spice Bloom
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {/* Center nav links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/shop">Shop</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blogs">Blogs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact</NavLink>
              </li>
            </ul>

            <div className="navbar-icons">
              <NavLink to="/wishlist" className="wishlist-icon">
                  <FontAwesomeIcon icon={faHeart} />
              </NavLink>
            </div>


          {/* Cart Icon */}
             <NavLink to="/cart" className="me-4 my-auto cart-icon">
                  <FontAwesomeIcon icon={faCartShopping} size="lg" />
                  <span className="cart-count">3</span>
             </NavLink>

             {/* User Icon */}
            <NavLink to="/profile" className="me-4 my-auto user-icon">
                <FontAwesomeIcon icon={faUser} size="lg" />
            </NavLink>


            {/* Login / Signup buttons */}
            <div className="auth-buttons d-flex gap-2">
              <NavLink to="/login" className="btn btn-success rounded-pill px-4 py-2">Login</NavLink>
              <NavLink to="/signup" className="btn btn-outline-success rounded-pill px-4 py-2">Signup</NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
