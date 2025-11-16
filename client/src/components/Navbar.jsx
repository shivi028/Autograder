import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onDashboard = location.pathname.includes("/dashboard");
  const onHome = location.pathname === "/";


  const navLinks = ["Features", "How It Works"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToDashboard = () => {
    if (isStudent) navigate(ROUTES.STUDENT_DASHBOARD);
    else if (isTeacher) navigate(ROUTES.TEACHER_DASHBOARD);
    else navigate("/");
  };


const buildBreadcrumbs = () => {
  const segments = location.pathname.split("/").filter(Boolean); // ["dashboard","teacher"]

  // not dashboard → no breadcrumbs
  if (!segments.includes("dashboard")) return [];

  const crumbs = [];

  // always first breadcrumb
  crumbs.push({ label: "Home", to: "/" });

  // find index of "dashboard"
  const dashIndex = segments.indexOf("dashboard");

  // segments after "dashboard"
  const after = segments.slice(dashIndex + 1); // ["teacher", "results"]

  // readable mapping
  const mapLabel = (seg) => {
    const map = {
      teacher: "Teacher",
      student: "Student",
      exams: "Exams",
      exam: "Exam",
      results: "Results",
      settings: "Settings",
      questions: "Questions",
      debug: "Debug Panel",
      management: "Management",
    };
    if (/^\d+$/.test(seg)) return seg;
    return map[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  let path = "/dashboard";

  after.forEach((seg) => {
    path += `/${seg}`;
    crumbs.push({
      label: mapLabel(seg),
      to: path,
    });
  });

  return crumbs;
};




  const breadcrumbs = onDashboard ? buildBreadcrumbs() : [];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-md" : "bg-white/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#016B61] flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-xl text-[#016B61]">Autograder</span>
        </Link>

        {/* Desktop Navigation */}
       {location.pathname === "/" && (
  <div className="hidden md:flex gap-8">
    {navLinks.map((link) => (
      <a
        key={link}
        href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-sm font-medium text-gray-700 hover:text-[#016B61]"
      >
        {link}
      </a>
    ))}
  </div>
)}

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          {!user ? (
            <>
              <Link to={ROUTES.LOGIN} className="brand-outline-btn px-4 py-2">
                Login
              </Link>
              <Link to={ROUTES.SIGNUP} className="brand-btn px-6 py-2">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {!onDashboard && (
                <button onClick={goToDashboard} className="brand-btn px-6 py-2 flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </button>
              )}
              <button onClick={logout} className="brand-outline-btn px-4 py-2 flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Dashboard Breadcrumb bar (only when inside any /dashboard route) */}
    {onDashboard && (
  <div className="w-full bg-[#acb777] text-white border ">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">

      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <span key={idx} className="flex items-center gap-3">
            <Link
              to={crumb.to}
              className={`text-sm ${
                isLast ? "font-semibold opacity-100" : "opacity-90 hover:underline"
              }`}
            >
              {crumb.label}
            </Link>
            {!isLast && <span className="opacity-60">/</span>}
          </span>
        );
      })}

    </div>
  </div>
)}


      {/* Mobile Menu */}
    
{isMobileMenuOpen && (
  <div className="md:hidden bg-white shadow-lg border-t border-gray-200 px-4 py-4 space-y-4">

    {/* Mobile NavLinks (only on home page) */}
    {location.pathname === "/" && (
      <div className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-gray-700 font-medium hover:text-[#016B61]"
          >
            {link}
          </a>
        ))}
      </div>
    )}

    {/* Mobile Buttons */}
    {!user ? (
      <>
        <Link
          to={ROUTES.LOGIN}
          className="block w-full brand-outline-btn text-center py-2"
        >
          Login
        </Link>
        <Link
          to={ROUTES.SIGNUP}
          className="block w-full brand-btn text-center py-2"
        >
          Sign Up
        </Link>
      </>
    ) : (
      <>
        {/* Dashboard Button — only if not already inside dashboard */}
        {!onDashboard && (
          <button
            onClick={goToDashboard}
            className="w-full brand-btn py-2 flex justify-center gap-2"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        )}

        {/* This is the missing Logout button */}  
        <button
          onClick={logout}
          className="w-full brand-outline-btn py-2 flex justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </>
    )}

  </div>
)}

    </nav>
  );
};

export default Navbar;
