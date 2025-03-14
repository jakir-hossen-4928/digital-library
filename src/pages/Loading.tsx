import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900 bg-opacity-60 transition-all duration-300">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-xl bg-gray-800 bg-opacity-70 shadow-2xl">
        {/* Enhanced spinner with Icon */}
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-t-4 border-t-indigo-500 border-indigo-300 border-opacity-20 rounded-full animate-spin"></div>

          {/* Middle ring */}
          <div className="absolute inset-1 border-4 border-t-4 border-t-indigo-400 border-indigo-300 border-opacity-10 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>

          {/* Icon */}
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-indigo-400 animate-spin" style={{ animationDuration: '1.2s' }} />
        </div>

        {/* Enhanced Loading Text */}
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium text-white sm:text-xl md:text-2xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Loading Your Library
          </p>
          <div className="mt-2 flex space-x-1">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0s' }}></span>
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;