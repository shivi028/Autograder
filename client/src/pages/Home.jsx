import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import InteractiveRoadmap from "./InteractiveRoadmap";
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
