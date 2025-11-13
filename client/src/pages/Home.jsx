import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Cloud,
  Brain,
  Zap,
  MessageSquare,
  Eye,
  BarChart3,
  FileCheck,
  Shield,
  Scan,
  Trophy,
  Users,
  Target,
  Clock,
  Star,
} from "lucide-react";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    papers: 0,
    accuracy: 0,
    teachers: 0,
    timeSaved: 0,
    rating: 0,
  });

  // // Navbar scroll effect
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 10);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Animate stats on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
        }
      });
    });

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    let papersCount = 0;
    let accuracyCount = 0;
    let teachersCount = 0;
    let timeSavedCount = 0;
    let ratingCount = 0;

    const interval = setInterval(() => {
      if (papersCount < 10000) papersCount += 333;
      if (accuracyCount < 95) accuracyCount += 3;
      if (teachersCount < 500) teachersCount += 16;
      if (timeSavedCount < 70) timeSavedCount += 2;
      if (ratingCount < 4.8) ratingCount += 0.16;

      setAnimatedStats({
        papers: Math.min(papersCount, 10000),
        accuracy: Math.min(accuracyCount, 95),
        teachers: Math.min(teachersCount, 500),
        timeSaved: Math.min(timeSavedCount, 70),
        rating: Math.min(ratingCount, 4.8),
      });

      if (papersCount >= 10000) clearInterval(interval);
    }, 50);
  };

  const navLinks = ["Features", "How It Works", "Pricing"];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 right-20 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-balance">
            Grade Smarter, Not Harder
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 text-balance max-w-2xl mx-auto">
            AI-powered exam grading that saves time and ensures accuracy.
            Transform your grading workflow in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Start Grading Now
            </Link>
          </div>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-center">
            {[
              { value: "10k+", label: "Papers Graded" },
              { value: "95%", label: "Accuracy" },
              { value: "70%", label: "Time Saved" },
              { value: "500+", label: "Teachers" },
              { value: "4.8★", label: "Rating" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm border border-rose-200 rounded-xl p-3 md:p-4 text-center hover:shadow-lg transition-all animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "3s",
                  animationIterationCount: "infinite",
                }}
              >
                <div className="text-sm md:text-lg font-bold text-indigo-600">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 px-4 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From Upload to Results in Minutes
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="grid md:grid-cols-5 gap-4 md:gap-2">
            {[
              {
                icon: Cloud,
                title: "Upload",
                description: "Upload answer sheets in any format",
              },
              {
                icon: Scan,
                title: "AI Scan",
                description: "OCR extracts all content",
              },
              {
                icon: Brain,
                title: "Smart Grade",
                description: "AI analyzes and scores",
              },
              {
                icon: Eye,
                title: "Review",
                description: "Verify and adjust scores",
              },
              {
                icon: Trophy,
                title: "Results",
                description: "Distribute to students",
              },
            ].map((step, i) => {
              const IconComponent = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 mx-auto">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {i < 4 && (
                    <div className="hidden md:block absolute top-1/3 -right-2 w-4 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">For Modern Education</p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: FileCheck,
                title: "AI-Powered OCR",
                description:
                  "Extract text from handwritten and printed answers",
              },
              {
                icon: Brain,
                title: "Semantic Analysis",
                description: "Understands context, not just keywords",
              },
              {
                icon: Zap,
                title: "Instant Grading",
                description: "Grade hundreds of papers in minutes",
              },
              {
                icon: MessageSquare,
                title: "Smart Feedback",
                description: "Personalized feedback for every student",
              },
              {
                icon: Eye,
                title: "Teacher Review",
                description: "Manual override and fine-tuning options",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Track performance trends and insights",
              },
              {
                icon: FileCheck,
                title: "Multi-Format",
                description: "Support PDF, JPG, PNG, and more",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Enterprise-grade data security",
              },
            ].map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats-section"
        className="py-24 px-4 bg-gradient-to-r from-indigo-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by Educators Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                value: Math.round(animatedStats.papers),
                label: "Papers Graded",
                icon: FileCheck,
              },
              {
                value: Math.round(animatedStats.accuracy),
                label: "Accuracy Rate",
                icon: Target,
                suffix: "%",
              },
              {
                value: Math.round(animatedStats.teachers),
                label: "Teachers Using",
                icon: Users,
              },
              {
                value: Math.round(animatedStats.timeSaved),
                label: "Time Saved",
                icon: Clock,
                suffix: "%",
              },
              {
                value: animatedStats.rating.toFixed(1),
                label: "User Rating",
                icon: Star,
                suffix: "★",
              },
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={24} />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Old Way vs. Autograder
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="border-2 border-gray-300 rounded-2xl p-8 bg-gradient-to-br from-gray-100 to-gray-50">
              <h3 className="text-2xl font-bold mb-6 text-gray-600">
                Traditional Grading
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "📚", text: "Stack of papers to manually grade" },
                  { icon: "😩", text: "Hours spent on repetitive work" },
                  { icon: "🧮", text: "Manual calculations and scoring" },
                  { icon: "⏰", text: "Delays in returning grades" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Autograder Way */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Autograder Way
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "☁️", text: "Upload all papers instantly" },
                  { icon: "✨", text: "AI handles grading automatically" },
                  { icon: "⚡", text: "Instant calculations and scoring" },
                  { icon: "🎉", text: "Results ready in minutes" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-900">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

  

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <h3 className="font-bold mb-4">Autograder</h3>
              <p className="text-sm text-gray-600">
                AI-powered exam grading for the modern educator.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "How It Works", "Demo"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "FAQs", "Status"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="font-bold mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 Autograder. All rights reserved.</p>
            <p>Built with ❤️ for educators</p>
          </div>
        </div>
      </footer>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center animate-pulse">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default Home;





