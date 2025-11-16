import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import {
  Cloud,
  Brain,
  Zap,
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
import InteractiveRoadmap from "./InteractiveRoadMap";
import AutograderHero from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ComparisonSection from "./ComparisonSection";

const Home = () => {
  const [animatedStats, setAnimatedStats] = useState({
    papers: 0,
    accuracy: 0,
    teachers: 0,
    timeSaved: 0,
    rating: 0,
  });

  // Animate stats
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && animateStats());
    });
    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    let papers = 0,
      accuracy = 0,
      teachers = 0,
      timeSaved = 0,
      rating = 0;

    const interval = setInterval(() => {
      if (papers < 10000) papers += 333;
      if (accuracy < 95) accuracy += 3;
      if (teachers < 500) teachers += 16;
      if (timeSaved < 70) timeSaved += 2;
      if (rating < 4.8) rating += 0.16;

      setAnimatedStats({
        papers: Math.min(papers, 10000),
        accuracy: Math.min(accuracy, 95),
        teachers: Math.min(teachers, 500),
        timeSaved: Math.min(timeSaved, 70),
        rating: Math.min(rating, 4.8),
      });

      if (papers >= 10000) clearInterval(interval);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-softbg text-gray-900">
      {/* Hero Section */}
      {/* <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden">
      
          <div
            className="absolute top-20 right-20 w-72 h-72 bg-[#70B2B2] rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-[#9ECFD4] rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#014E48] to-[#016B61] bg-clip-text text-transparent">
            Grade Smarter, Not Harder
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            AI-powered exam grading that saves time and ensures accuracy.
            Transform your grading workflow in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary text-[#016B61] rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
            >
              Start Grading Now
            </Link>
          </div>

     
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
                className="bg-white/70 backdrop-blur-sm border border-secondary rounded-xl p-3 md:p-4 text-center hover:shadow-lg transition-all animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "3s",
                  animationIterationCount: "infinite",
                }}
              >
                <div className="text-sm md:text-lg font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <AutograderHero/>

      {/* How It Works */}
      <InteractiveRoadmap/>

      {/* Features */}
      <FeaturesSection/>


      {/* Comparison */}
      <ComparisonSection/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
