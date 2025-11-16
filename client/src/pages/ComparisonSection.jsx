import React from 'react';
import { Clock, FileStack, User, TrendingUp, Upload, Sparkles, Award, Zap } from "lucide-react";

const ComparisonSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-[#E5E9C5]">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#9ECFD4]/20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-[#016B61]/10 blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-48 h-48 rounded-full bg-[#70B2B2]/15 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 rounded-full bg-[#9ECFD4]/25 blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Premium Hero Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl  sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#014E48] to-[#016B61] bg-clip-text text-transparent mb-3 drop-shadow-lg">
            The Old Way vs Autograder
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#016B61] via-[#70B2B2] to-[#016B61] rounded-full opacity-60" />
        </div>

        {/* Comparison Panels */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          
          {/* OLD WAY PANEL */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-gray-400/10 rounded-3xl blur-xl transform group-hover:scale-95 transition-transform duration-500" />
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-300/40 shadow-lg transform lg:-rotate-1 group-hover:rotate-0 transition-all duration-500">
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200/30 rounded-bl-2xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-600">
                    Traditional Grading
                  </h2>
                  <div className="text-4xl opacity-30">📚</div>
                </div>

                <div className="space-y-4 ">
                  {[
                    { icon: FileStack, text: "Stack of papers", desc: "Physical submission management" },
                    { icon: Clock, text: "Hours of work", desc: "Manual review process" },
                    { icon: User, text: "Manual scoring", desc: "Subjective evaluation" },
                    { icon: TrendingUp, text: "Delayed results", desc: "Days or weeks of waiting" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-100/50 border border-gray-300/30 backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200/50 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-600 mb-0.5">
                          {item.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NEW WAY PANEL - AUTOGRADER */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#016B61]/30 via-[#70B2B2]/20 to-[#9ECFD4]/30 rounded-3xl blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
            
            <div className="relative bg-[#9ECFD4]/40 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#70B2B2]/50 transform lg:rotate-1 group-hover:scale-105 group-hover:rotate-0 transition-all duration-500">
              {/* Glowing corner accents */}
              <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-[#70B2B2]/40 to-transparent rounded-full blur-2xl" />
              <div className="absolute -bottom-1 -left-1 w-24 h-24 bg-gradient-to-tr from-[#016B61]/40 to-transparent rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#016B61] drop-shadow-lg">
                    Autograder Way
                  </h2>
                  <div className="relative">
                    <Sparkles className="w-10 h-10 text-[#016B61] drop-shadow-lg" strokeWidth={2} />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="w-10 h-10 text-[#016B61]/40" strokeWidth={2} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { 
                      icon: Upload, 
                      text: "Upload instantly", 
                      desc: "Simple drag-and-drop interface",
                      gradient: "from-[#016B61]/20 to-[#70B2B2]/10"
                    },
                    { 
                      icon: Sparkles, 
                      text: "AI handles grading", 
                      desc: "Intelligent automated evaluation",
                      gradient: "from-[#70B2B2]/20 to-[#9ECFD4]/10"
                    },
                    { 
                      icon: Award, 
                      text: "Instant scoring", 
                      desc: "Real-time feedback generation",
                      gradient: "from-[#9ECFD4]/20 to-[#016B61]/10"
                    },
                    { 
                      icon: Zap, 
                      text: "Results in minutes", 
                      desc: "Lightning-fast turnaround time",
                      gradient: "from-[#70B2B2]/20 to-[#016B61]/10"
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`relative flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${item.gradient} border border-[#70B2B2]/30 backdrop-blur-sm group/item hover:scale-105 transition-transform duration-300`}
                    >
                      {/* Floating icon container with glow */}
                      <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-[#016B61]/20 rounded-lg blur-md group-hover/item:blur-lg transition-all" />
                        <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-[#016B61] to-[#014b43] flex items-center justify-center shadow-lg">
                          <item.icon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-base font-bold text-[#016B61] drop-shadow-sm mb-0.5">
                          {item.text}
                        </p>
                        <p className="text-xs text-[#014b43]/80 font-medium">
                          {item.desc}
                        </p>
                      </div>

                      {/* Sparkle decorations */}
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#70B2B2] rounded-full opacity-60 animate-ping" />
                    </div>
                  ))}
                </div>

                {/* Floating geometric shapes inside panel */}
                <div className="absolute top-1/4 -right-2 w-12 h-12 border-2 border-[#70B2B2]/30 rounded-lg rotate-12 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-1/3 -left-2 w-10 h-10 border-2 border-[#016B61]/30 rounded-full animate-pulse pointer-events-none" style={{ animationDuration: '5s', animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#70B2B2]/30 shadow-lg">
            <Zap className="w-4 h-4 text-[#016B61]" />
            <span className="text-xs font-semibold text-[#016B61]">
              Experience the future of grading
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;