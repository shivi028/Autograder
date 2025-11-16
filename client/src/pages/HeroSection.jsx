import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, Zap, TrendingUp, Award, Clock } from 'lucide-react';

const AutograderHero = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setGradingProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const accuracyInterval = setInterval(() => {
      setAccuracy((prev) => (prev >= 99.8 ? 85 : prev + 0.3));
    }, 100);
    return () => clearInterval(accuracyInterval);
  }, []);

  const features = [
    { icon: Zap, label: '10x Faster', color: 'from-[#016B61] to-[#70B2B2]' },
    { icon: CheckCircle, label: '99.8% Accurate', color: 'from-[#70B2B2] to-[#9ECFD4]' },
    { icon: Award, label: 'AI-Powered', color: 'from-[#9ECFD4] to-[#016B61]' }
  ];

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#E5E9C5] via-[#eeefed] to-[#E5E9C5]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#70B2B2] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#9ECFD4] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#016B61] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-[#9ECFD4] shadow-lg">
              <Sparkles className="w-4 h-4 text-[#016B61]" />
              <span className="text-sm font-semibold text-[#014b43]">AI-Powered Grading Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#014E48] to-[#016B61] bg-clip-text text-transparent">
                Grade Smarter,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#016B61] to-[#70B2B2] bg-clip-text text-transparent">
                Not Harder
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
              Transform hours of grading into minutes with our advanced AI technology. Get accurate, consistent results while freeing up time for what matters most—teaching.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-[#016B61] to-[#014b43] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Grading Now
                  <Zap className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#70B2B2] to-[#016B61] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
            </div>
          </div>

          {/* Right Interactive Component */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#9ECFD4] p-8 transform hover:scale-[1.02] transition-all duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#014b43]">Grading Dashboard</h3>
                <div className="px-4 py-2 bg-gradient-to-r from-[#016B61] to-[#70B2B2] text-white rounded-full text-sm font-semibold">
                  Live Preview
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Processing Papers...</span>
                  <span className="font-bold text-[#016B61]">{gradingProgress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#016B61] to-[#70B2B2] transition-all duration-300 rounded-full"
                    style={{ width: `${gradingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Accuracy Meter */}
              <div className="mb-6 p-4 bg-gradient-to-br from-[#E5E9C5] to-[#F7FAF9] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">AI Accuracy Rate</span>
                  <Sparkles className="w-5 h-5 text-[#016B61] animate-pulse" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#016B61] to-[#70B2B2] bg-clip-text text-transparent">
                  {accuracy.toFixed(1)}%
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl transition-all duration-500 cursor-pointer ${
                        activeCard === idx
                          ? 'bg-gradient-to-br ' + feature.color + ' shadow-xl scale-110'
                          : 'bg-white border border-[#9ECFD4] hover:shadow-lg'
                      }`}
                      onClick={() => setActiveCard(idx)}
                    >
                      <Icon className={`w-6 h-6 mb-2 mx-auto ${activeCard === idx ? 'text-white' : 'text-[#016B61]'}`} />
                      <p className={`text-xs font-semibold text-center ${activeCard === idx ? 'text-white' : 'text-[#014b43]'}`}>
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pulse Animation */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#016B61] rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#016B61] rounded-full"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#9ECFD4] p-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#016B61] to-[#70B2B2] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Grading Speed</p>
                  <p className="text-lg font-bold text-[#016B61]">10x Faster</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#9ECFD4] p-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#70B2B2] to-[#9ECFD4] rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Time Saved</p>
                  <p className="text-lg font-bold text-[#016B61]">70%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default AutograderHero;