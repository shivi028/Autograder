import React, { useState } from 'react';
import { FileCheck, Brain, Zap, Eye, BarChart3, FileText } from 'lucide-react';

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    { 
      icon: FileCheck, 
      title: "AI OCR", 
      description: "Extract text and data from documents with precision using advanced optical recognition.",
      color: "from-[#016B61] to-[#014b43]",
      bgColor: "bg-[#016B61]",
      borderColor: "border-[#016B61]"
    },
    { 
      icon: Brain, 
      title: "Semantic AI", 
      description: "Understand context and nuance with intelligent language processing capabilities.",
      color: "from-[#70B2B2] to-[#016B61]",
      bgColor: "bg-[#70B2B2]",
      borderColor: "border-[#70B2B2]"
    },
    { 
      icon: Zap, 
      title: "Instant Grading", 
      description: "Automatically evaluate submissions and save hours of manual grading work.",
      color: "from-[#9ECFD4] to-[#70B2B2]",
      bgColor: "bg-[#9ECFD4]",
      borderColor: "border-[#9ECFD4]"
    },
    { 
      icon: Eye, 
      title: "Teacher Review", 
      description: "Maintain full control with comprehensive teacher oversight and approval workflows.",
      color: "from-[#016B61] to-[#70B2B2]",
      bgColor: "bg-[#016B61]",
      borderColor: "border-[#016B61]"
    },
    { 
      icon: BarChart3, 
      title: "Analytics", 
      description: "Track progress with detailed insights and comprehensive performance metrics.",
      color: "from-[#70B2B2] to-[#9ECFD4]",
      bgColor: "bg-[#70B2B2]",
      borderColor: "border-[#70B2B2]"
    },
    { 
      icon: FileText, 
      title: "Multi-Format", 
      description: "Support for PDF, JPG, PNG, and other formats for maximum flexibility.",
      color: "from-[#9ECFD4] to-[#016B61]",
      bgColor: "bg-[#9ECFD4]",
      borderColor: "border-[#9ECFD4]"
    },
  ];

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-[#E5E9C5] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#70B2B2] rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#9ECFD4] rounded-full filter blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E5E9C5] rounded-full mb-4">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-semibold text-[#014b43]">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#014b43] mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-700">Built for modern education with cutting-edge AI technology</p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === i;
            
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative bg-white rounded-3xl p-8 h-full transition-all duration-500 border-2 ${
                  isHovered 
                    ? `${feature.borderColor} shadow-2xl scale-105 -translate-y-2` 
                    : 'border-gray-200 shadow-md hover:shadow-xl'
                }`}>
                  
                  {/* Icon Container */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-3' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                    
                    {/* Glow effect on hover */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-2xl bg-white opacity-30 animate-ping"></div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-[#014b43] mb-3 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom gradient bar - shows on hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 p-[0.2rem] mb-[0.01rem] rounded-bl-full rounded-br-full ml-[0.3rem] mr-[0.3rem] bg-gradient-to-r ${feature.color} transition-all duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}></div>

                  {/* Corner decoration */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${feature.bgColor} transition-all duration-500 ${
                    isHovered ? 'scale-150' : 'scale-100'
                  }`}></div>
                </div>

                {/* Floating shadow effect */}
                {isHovered && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-3xl blur-xl -z-10 transition-all duration-500`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
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

export default FeaturesSection;