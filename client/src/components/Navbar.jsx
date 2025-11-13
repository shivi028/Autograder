import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isStudent, isTeacher, loading } = useAuth();
  const navigate = useNavigate();
  
  const navLinks = ["Features", "How It Works", "Pricing"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => {
    if (isStudent) {
      navigate(ROUTES.STUDENT_DASHBOARD);
    } else if (isTeacher) {
      navigate(ROUTES.TEACHER_DASHBOARD);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg"
          : "bg-gradient-to-b from-white via-white to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl hidden sm:inline">
            Autograder
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex gap-3">
          {!loading && (
            <>
              {!user ? (
                // Not logged in - Show Login & Sign Up
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all shadow-md shadow-purple-500/30"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                // Logged in - Show Dashboard Button
                <button
                  onClick={handleDashboardClick}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all shadow-md shadow-purple-500/30 flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            
            {/* Mobile Auth Buttons */}
            {!loading && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {!user ? (
                  // Not logged in - Show Login & Sign Up
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 hover:text-indigo-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.SIGNUP}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  // Logged in - Show Dashboard Button
                  <button
                    onClick={handleDashboardClick}
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;