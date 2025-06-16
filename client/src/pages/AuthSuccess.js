import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

export default function SignUpWelcomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const contentTimer = setTimeout(() => setShowContent(true), 800);
    
    // Auto redirect to home page after 4 seconds
    const redirectTimer = setTimeout(() => {
      window.location.href = '/'; // Change this to your home page route
    }, 4000);
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  const spices = ['🌶️', '🧄', '🧅', '🌿', '⭐', '🫚', '🌾', '🍃'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {spices.map((spice, index) => (
          <div
            key={index}
            className={`absolute text-2xl opacity-20 animate-pulse ${
              isVisible ? 'animate-bounce' : ''
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {spice}
          </div>
        ))}
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30 blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-30 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Content */}
      <div className={`relative z-10 text-center transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-2xl transform transition-all duration-700 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Animated rings */}
          <div className={`absolute inset-0 rounded-full border-2 border-green-400 animate-ping ${
            isVisible ? 'opacity-75' : 'opacity-0'
          }`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`} style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Brand Name */}
        <div className={`mb-6 transform transition-all duration-700 delay-300 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-2">
            Spice Bloom
          </h1>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-lg font-medium tracking-wide">Premium Spices & Flavors</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className={`mb-8 transform transition-all duration-700 delay-500 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Spice Bloom!
          </h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you for joining us! Get ready to discover the finest collection of premium spices from around the world.
          </p>
          <div className="mt-6 text-green-600 font-medium">
            Redirecting to homepage in a moment...
          </div>
        </div>

        {/* Feature Highlights */}
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transform transition-all duration-700 delay-700 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/80 hover:bg-green-50/50">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm">Hand-selected spices from the finest sources worldwide</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/80 hover:bg-green-50/50">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fresh & Aromatic</h3>
            <p className="text-gray-600 text-sm">Delivered fresh to preserve maximum flavor and aroma</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/80 hover:bg-green-50/50">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Quick and secure delivery right to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
}