import React from 'react';

const Loading = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#E5E9C5] flex items-center justify-center z-50 overflow-hidden">
        {/* Soft theme blobs */}
        <div className="absolute -top-32 -left-20 w-72 h-72 bg-[#70B2B2] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-32 -right-24 w-72 h-72 bg-[#9ECFD4] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

        <div className="text-center relative z-10">
          {/* AI Orbit Loader */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Center AI Core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulsing core */}
                <div className="w-8 h-8 bg-gradient-to-br from-[#016B61] to-[#70B2B2] rounded-full animate-pulse shadow-lg shadow-[#016B61]/50"></div>
                
                {/* AI Sparkle effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" opacity="0.8"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Orbit Ring 1 - Fast */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#016B61] rounded-full shadow-md shadow-[#016B61]/30"></div>
            </div>

            {/* Orbit Ring 2 - Medium */}
            <div className="absolute inset-2 animate-spin-reverse" style={{ animationDuration: '4s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#70B2B2] rounded-full shadow-md shadow-[#70B2B2]/30"></div>
            </div>

            {/* Orbit Ring 3 - Slow */}
            <div className="absolute inset-4 animate-spin" style={{ animationDuration: '5s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#9ECFD4] rounded-full shadow-md shadow-[#9ECFD4]/30"></div>
            </div>

            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#016B61]/20 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#70B2B2]/20"></div>
          </div>

          {message && (
            <p className="mt-8 text-[#014b43] font-medium tracking-wide animate-pulse">
              {message}
            </p>
          )}

          {/* AI Processing indicator */}
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-[#016B61] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#70B2B2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#9ECFD4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 4s linear infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Small AI Orbit Loader */}
      <div className="relative w-20 h-20">
        {/* Center AI Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulsing core */}
            <div className="w-5 h-5 bg-gradient-to-br from-[#016B61] to-[#70B2B2] rounded-full animate-pulse shadow-md shadow-[#016B61]/50"></div>
            
            {/* AI Sparkle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" opacity="0.8"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Orbit Ring 1 */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#016B61] rounded-full shadow-sm shadow-[#016B61]/30"></div>
        </div>

        {/* Orbit Ring 2 */}
        <div className="absolute inset-1 animate-spin-reverse" style={{ animationDuration: '4s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#70B2B2] rounded-full shadow-sm shadow-[#70B2B2]/30"></div>
        </div>

        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full border border-[#016B61]/20 animate-ping" style={{ animationDuration: '2s' }}></div>
      </div>

      {message && (
        <p className="mt-4 text-[#014b43] font-medium tracking-wide">
          {message}
        </p>
      )}

      {/* Processing dots */}
      <div className="mt-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-[#016B61] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-[#70B2B2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-[#9ECFD4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;