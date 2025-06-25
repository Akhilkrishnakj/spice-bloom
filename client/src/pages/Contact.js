import React from 'react'
import Layout from '../components/Layouts/Layout'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLeaf, FaGlobe, FaTruck, FaSeedling } from 'react-icons/fa';

const Contact = () => {
  return (
    <Layout title={"Contact Us - Spice Bloom"}>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Company Highlight Section */}
        <div className="w-full max-w-3xl bg-gradient-to-r from-green-600 to-green-400 rounded-2xl shadow-lg p-8 mb-12 text-white text-center">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Why Choose <span className="text-white">Spice Bloom</span>?</h2>
          <p className="text-lg mb-4">Spice Bloom brings the world's finest, freshest spices directly from Indian farms to your kitchen. We are passionate about purity, flavor, and supporting sustainable farming communities.</p>
          <p className="text-base">Our mission is to deliver authentic, organic, and ethically sourced spices that elevate your cooking and nourish your well-being. Experience the true taste of India with every pinch!</p>
        </div>

        {/* Key Points Section */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center bg-green-50 rounded-2xl p-6 shadow group">
            <FaLeaf className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-semibold text-green-800 mb-1">100% Organic</h4>
            <p className="text-green-700 text-center text-sm">All our spices are grown without chemicals or pesticides, ensuring pure, natural flavor.</p>
          </div>
          <div className="flex flex-col items-center bg-green-50 rounded-2xl p-6 shadow group">
            <FaSeedling className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-semibold text-green-800 mb-1">Farm-to-Table</h4>
            <p className="text-green-700 text-center text-sm">We partner directly with Indian farmers for the freshest harvest and fair trade practices.</p>
          </div>
          <div className="flex flex-col items-center bg-green-50 rounded-2xl p-6 shadow group">
            <FaTruck className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-semibold text-green-800 mb-1">Fast Global Shipping</h4>
            <p className="text-green-700 text-center text-sm">Enjoy our spices anywhere in the world with reliable, eco-friendly delivery.</p>
          </div>
          <div className="flex flex-col items-center bg-green-50 rounded-2xl p-6 shadow group">
            <FaGlobe className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-semibold text-green-800 mb-1">Authentic Flavors</h4>
            <p className="text-green-700 text-center text-sm">Discover rare and regional Indian spices, hand-selected for their aroma and taste.</p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center bg-green-600 rounded-2xl p-8 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 group cursor-pointer">
            <FaEnvelope className="text-white text-3xl mb-3 group-hover:text-green-100 transition-colors duration-300" />
            <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
            <p className="text-green-100 group-hover:text-white transition-colors duration-300">support@spicebloom.com</p>
          </div>
          <div className="flex flex-col items-center bg-green-600 rounded-2xl p-8 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 group cursor-pointer">
            <FaPhoneAlt className="text-white text-3xl mb-3 group-hover:text-green-100 transition-colors duration-300" />
            <h4 className="text-lg font-semibold text-white mb-1">Toll-Free</h4>
            <p className="text-green-100 group-hover:text-white transition-colors duration-300">1800-123-456 (24/7 Support)</p>
        </div>
          <div className="flex flex-col items-center bg-green-600 rounded-2xl p-8 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 group cursor-pointer">
            <FaMapMarkerAlt className="text-white text-3xl mb-3 group-hover:text-green-100 transition-colors duration-300" />
            <h4 className="text-lg font-semibold text-white mb-1">Head Office</h4>
            <p className="text-green-100 group-hover:text-white transition-colors duration-300">123 Spice Street, Kochi, Kerala, India</p>
        </div>
      </div>

        {/* Google Form Section */}
        <div className="w-full max-w-3xl bg-green-50 rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Send us a message</h3>
          <div className="rounded-xl overflow-hidden border-4 border-green-600">
        <iframe
          title="Google Form"
          src="https://docs.google.com/forms/d/e/1FAIpQLSeXxxxxxxxxxxxxx/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
              className="w-full"
        >
          Loading…
        </iframe>
          </div>
      </div>

        {/* Google Map Section */}
        <div className="w-full max-w-3xl bg-green-50 rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Our Location</h3>
          <div className="rounded-xl overflow-hidden border-4 border-green-600">
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.123456789!2d76.26730499999999!3d9.931232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d5a214dbbb1%3A0x12abc345def67890!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1680933489345!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
        ></iframe>
      </div>
    </div>
      </div>
  </Layout>
  )
}

export default Contact
