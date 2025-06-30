import React from "react";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
      <div className="flex flex-col items-center">
        {/* Floating Spinner */}
        <div className="relative mb-8 animate-float">
          <span className="block w-20 h-20 rounded-full border-8 border-green-500 border-t-white animate-spin shadow-lg"></span>
          {/* Glass reflection */}
          <span className="absolute top-2 left-2 w-8 h-3 bg-white/40 rounded-full blur-sm"></span>
        </div>
        {/* Brand Name with floating animation */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 drop-shadow-lg animate-float-slow tracking-wide select-none">
          Spice <span className="text-white bg-green-500 px-3 py-1 rounded-xl shadow-md">Bloom</span>
        </h1>
      </div>
      {/* Custom keyframes for floating */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader; 