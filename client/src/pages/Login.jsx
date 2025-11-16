import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Loading from "@/components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);

      toast.success("Login successful!");

      navigate(
        data?.user?.role === "student"
          ? "/dashboard/student"
          : "/dashboard/teacher"
      );
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        error?.response?.data?.message ||
        "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Generate background icons on left and right sides only
  const generateIconPositions = () => {
    const icons = ["📘", "📄", "🎓", "📝", "📚", "🖊️", "📑", "🗂️", "📔", "🧠", "✏️", "📖", "🎯", "💡", "🔖"];
    const positions = [];
    
    // Generate icons for left and right sides
    for (let i = 0; i < 24; i++) {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.random() * 50 + 70; // 70px - 120px
      const opacity = Math.random() * 0.15 + 0.1; // 0.1 - 0.25
      const floatDelay = Math.random() * 3;
      const floatDuration = Math.random() * 4 + 6; // 6–10 seconds
      const rotation = Math.random() * 30 - 15; // -15deg to 15deg
      
      // Random vertical position (full height)
      const top = Math.random() * 90 + 5; // 5% - 95%
      
      // Position on left or right side
      let left;
      if (i % 2 === 0) {
        // Left side: 0% - 25%
        left = Math.random() * 25;
      } else {
        // Right side: 75% - 100%
        left = Math.random() * 30 + 75;
      }
      
      positions.push({
        id: i,
        icon,
        top,
        left,
        size,
        opacity,
        floatDelay,
        floatDuration,
        rotation,
        color: ["#016B61", "#70B2B2", "#9ECFD4", "#014b43"][i % 4]
      });
    }
    
    return positions;
  };

  const iconPositions = generateIconPositions();

  return (
    <div className="relative min-h-[70%] flex items-center justify-center px-4 py-8 overflow-hidden -mt-[1rem]">
      <div className="absolute inset-0 bg-[#eeefed]"></div>

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.12] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Background Icons */}
      {iconPositions.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
          animate={{
            opacity: item.opacity,
            scale: 1,
            y: [0, -20, 0],
            rotate: [item.rotation, item.rotation + 5, item.rotation],
          }}
          transition={{
            duration: item.floatDuration,
            repeat: Infinity,
            delay: item.floatDelay,
            ease: "easeInOut",
          }}
          className="absolute select-none pointer-events-none drop-shadow-lg"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            filter: "blur(1px)",
            color: item.color,
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#9ECFD4]">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#016B61] to-[#70B2B2] rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-[#014b43] mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account to continue
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#014b43] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#014b43] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#016B61] hover:bg-[#014b43] text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
            >
              {loading ? <Loading message="Signing in...res"/>  : "Sign In"}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#016B61] hover:text-[#014b43] font-semibold"
            >
              Sign up
            </Link>
          </p>
          <p className="text-center text-gray-600 mt-[0.5]">
            Forgot Password?{" "}
            <Link
              to="/forgot-password"
              className="text-[#016B61] hover:text-[#014b43] font-semibold"
            >
              Reset
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}