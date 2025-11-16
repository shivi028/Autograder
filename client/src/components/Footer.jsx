import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#016B61] border-t border-[#014B43]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

          {/* LEFT SIDE */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <GraduationCap className="h-6 w-6 text-[#016B61]" />
              </div>
              <span className="text-2xl font-bold text-white">
                AutoGrader
              </span>
            </Link>

            <p className="text-sm text-white/90 max-w-sm">
              Revolutionizing education with intelligent automated grading
              and instant feedback for students and teachers.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="text-center md:text-right text-sm text-white/80 sm:mt-10">
            © 2025 AutoGrader. All rights reserved.
          </div>

        </div>

      </div>
    </footer>
  );
}
