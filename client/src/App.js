import React from 'react';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './pages/Home';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PageNotFound from './pages/PageNotFound';
import Signup from './pages/Signup';
import LoginPage from './pages/LoginPage';
import About from './pages/About';
import Policy from './pages/Policy';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import VerifyOTP from './pages/VerifyOtp';
import AuthSuccess from './pages/AuthSuccess';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/Routes/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import Products from './pages/Admin/Products';
import ProtectiveRoute from './components/Routes/ProtectiveRoute';
import TestAdmin from './pages/test-page';
import ProductManagement from './pages/Admin/ProductManagement';
import Orders from './pages/Admin/Orders';
import './'; // Import your global styles
import UserManagement from './pages/Admin/UserManagement';
import OfferManagement from './pages/Admin/Offers';

function App() {
  return (
    
    <AuthProvider>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/blogs' element={<Blog />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/policy' element={<Policy />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/success' element={<AuthSuccess />} />
        <Route path='*' element={<PageNotFound />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectiveRoute />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/products' element={<Products />} />
          <Route path="/test-admin" element={<TestAdmin />} />
          <Route path='/admin/products-manage' element={<ProductManagement />} />
          <Route path='/admin/orders' element={<Orders />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/offers' element={<OfferManagement/>}/>

        </Route>

      </Routes>

      <ToastContainer />
    </AuthProvider>
  );
}


export default App;
