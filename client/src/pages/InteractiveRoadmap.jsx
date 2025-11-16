import React, { useState } from 'react';
import { Cloud, Scan, Brain, Eye, Trophy } from 'lucide-react';

const InteractiveRoadmap = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      icon: Cloud, 
      title: "Upload", 
      description: "Upload answer sheets securely",
      detail: "Simply drag and drop your scanned answer sheets or PDFs. We support multiple formats and batch uploads.",
      color: "from-[#016B61] to-[#014b43]",
      accentColor: "bg-[#016B61]"
    },
    { 
      icon: Scan, 
      title: "AI Scan", 
      description: "OCR extracts content",
      detail: "Advanced OCR technology reads handwriting and typed text with 95%+ accuracy, even with messy handwriting.",
      color: "from-[#70B2B2] to-[#016B61]",
      accentColor: "bg-[#70B2B2]"
    },
    { 
      icon: Brain, 
      title: "Smart Grade", 
      description: "AI scores answers",
      detail: "Our AI understands context, evaluates semantic meaning, and assigns marks based on your marking scheme.",
      color: "from-[#9ECFD4] to-[#70B2B2]",
      accentColor: "bg-[#9ECFD4]"
    },
    { 
      icon: Eye, 
      title: "Review", 
      description: "Verify and adjust",
      detail: "Teachers can review AI suggestions, modify marks, and add personalized feedback before finalizing.",
      color: "from-[#70B2B2] to-[#9ECFD4]",
      accentColor: "bg-[#70B2B2]"
    },
    { 
      icon: Trophy, 
      title: "Results", 
      description: "Instant results",
      detail: "Students get detailed results with question-wise breakdown, feedback, and performance analytics instantly.",
      color: "from-[#016B61] to-[#70B2B2]",
      accentColor: "bg-[#016B61]"
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-[#EEF4EE] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#9ECFD4] rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#70B2B2] rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#014b43]">
            How It Works
          </h2>
          <p className="text-xl text-gray-700">Experience the Future of Grading</p>
        </div>

        {/* Mobile View - Vertical Timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            
            return (
              <div 
                key={i}
                onClick={() => setActiveStep(i)}
                className="relative"
              >
                {/* Connecting Line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-[#016B61] to-[#9ECFD4] opacity-30"></div>
                )}

                {/* Step Card */}
                <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 ${
                  isActive ? 'shadow-2xl scale-105 border-2 border-[#016B61]' : 'shadow-md hover:shadow-lg border border-gray-200'
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Icon Circle */}
                    <div className={`relative flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={24} />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#016B61]">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-[#014b43] mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      {/* Expandable Detail */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        isActive ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="bg-[#E5E9C5] rounded-lg p-3 text-sm text-gray-700">
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View - Curved Path */}
        <div className="hidden md:block relative">
          {/* SVG Path */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ height: '400px' }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#016B61" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#70B2B2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#9ECFD4" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 50 200 Q 250 50, 450 200 T 850 200 Q 1050 350, 1250 200"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
          </svg>

          {/* Step Cards */}
          <div className="relative grid grid-cols-5 gap-4 pt-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              const isOdd = i % 2 === 1;
              
              return (
                <div 
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  className="relative"
                  style={{
                    marginTop: isOdd ? '160px' : '0px'
                  }}
                >
                  {/* Floating Card */}
                  <div className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'shadow-2xl scale-110 -translate-y-4 border-2 border-[#016B61]' 
                      : 'shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200'
                  }`}>
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#016B61] to-[#70B2B2] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {i + 1}
                    </div>

                    {/* Icon with Glow */}
                    <div className={`relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-xl ${
                      isActive ? 'animate-pulse' : ''
                    }`}>
                      <Icon size={28} />
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-ping"></div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-center text-[#014b43] mb-2">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-center text-gray-600 mb-3">
                      {step.description}
                    </p>

                    {/* Detail - Expands on hover */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="bg-[#E5E9C5] rounded-lg p-3 text-xs text-gray-700 leading-relaxed">
                        {step.detail}
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#016B61] to-[#70B2B2] rounded-full"></div>
                    )}
                  </div>

                  {/* Connection Dot */}
                  <div className={`absolute ${isOdd ? '-top-4' : 'bottom-0'} left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${step.accentColor} border-2 border-white shadow-md transition-all duration-300 ${
                    isActive ? 'scale-150' : ''
                  }`}></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Progress Indicator */}
        <div className="hidden md:flex justify-center items-center gap-2 mt-12">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`transition-all duration-300 ${
                activeStep === i 
                  ? 'w-12 h-3 bg-gradient-to-r from-[#016B61] to-[#70B2B2]' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              } rounded-full`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default InteractiveRoadmap;