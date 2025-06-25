import React from 'react'
import { Leaf } from 'lucide-react'
const Footer = () => {      
  return (
    <div className="footer">
    {/* Newsletter Section */}
    <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers and spice recipes
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button 
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-4 rounded-r-full font-semibold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">SpiceBloom</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Premium spices and blends sourced directly from farms to bring authentic flavors to your kitchen.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-emerald-400 transition-colors">Home</a></li>
                <li><a href="/shop" className="hover:text-emerald-400 transition-colors">Spices</a></li>
                <li><a href="/contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="/shipping" className="hover:text-emerald-400 transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-emerald-400 transition-colors">Returns</a></li>
                <li><a href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@spicebloom.com</p>
                <p>📞 +91 9778798091</p>
                <p>📍 123 Spice Street, Delhi, India</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SpiceBloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
  </div>
  
  )
}

export default Footer
