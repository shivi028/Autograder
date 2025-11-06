import React from 'react';

const Loading = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          {message && <p className="mt-6 text-gray-600 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
      {message && <p className="mt-4 text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default Loading;