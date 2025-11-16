import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    student_id: '',
    teacher_id: '',
    phone: '',
    course: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) {
      toast.error('Please select account type');
      return;
    }

    setLoading(true);
    console.log('🚀 Submitting registration...', { ...formData, user_type: userType });

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        user_type: userType,
        phone: formData.phone || null
      };

      if (userType === 'student') {
        if (!formData.student_id) {
          toast.error('Student ID is required');
          setLoading(false);
          return;
        }
        registrationData.student_id = formData.student_id;
        registrationData.course = formData.course || null;
      } else if (userType === 'teacher') {
        if (!formData.teacher_id) {
          toast.error('Teacher ID is required');
          setLoading(false);
          return;
        }
        registrationData.teacher_id = formData.teacher_id;
        registrationData.department = formData.department || null;
      }

      console.log('📤 Sending registration data:', registrationData);
      const data = await register(registrationData);

      console.log('✅ Registration successful:', data);
      toast.success('Registration successful!');

      const role = data?.user?.role;
      if (role === 'student') navigate('/dashboard/student');
      else if (role === 'teacher') navigate('/dashboard/teacher');
      else navigate('/');
    } catch (error) {
      console.error('❌ Registration error:', error);
      const message =
        error?.message ||
        error?.data?.message ||
        error?.response?.data?.message ||
        'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Generate background icons on left and right sides
  const generateIconPositions = () => {
    const icons = ["📘", "📄", "🎓", "📝", "📚", "🖊️", "📑", "🗂️", "📔", "🧠", "✏️", "📖", "🎯", "💡", "🔖"];
    const positions = [];
    
    for (let i = 0; i < 24; i++) {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.random() * 50 + 70;
      const opacity = Math.random() * 0.15 + 0.1;
      const floatDelay = Math.random() * 3;
      const floatDuration = Math.random() * 4 + 6;
      const rotation = Math.random() * 30 - 15;
      const top = Math.random() * 90 + 5;
      
      let left;
      if (i % 2 === 0) {
        left = Math.random() * 25;
      } else {
        left = Math.random() * 25 + 75;
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#9ECFD4]">
          <h2 className="text-3xl font-bold text-center text-[#014b43] mb-8">Create Your Account</h2>

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">Select your account type</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { 
                    setUserType('student'); 
                    setStep(2);
                    console.log('Selected user type: student');
                  }}
                  className={`p-8 border-2 rounded-2xl transition-all group ${
                    userType === 'student'
                      ? 'border-[#016B61] bg-[#E5E9C5]'
                      : 'border-[#9ECFD4] hover:border-[#016B61] hover:bg-[#E5E9C5]'
                  }`}
                >
                  <div className="w-16 h-16 bg-[#9ECFD4] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#016B61] transition-colors">
                    <svg className="w-8 h-8 text-[#016B61] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#014b43] text-center">Student</h3>
                  <p className="text-gray-600 text-center mt-2 text-sm">Upload and view exam results</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { 
                    setUserType('teacher'); 
                    setStep(2);
                    console.log('Selected user type: teacher');
                  }}
                  className={`p-8 border-2 rounded-2xl transition-all group ${
                    userType === 'teacher'
                      ? 'border-[#70B2B2] bg-[#E5E9C5]'
                      : 'border-[#9ECFD4] hover:border-[#70B2B2] hover:bg-[#E5E9C5]'
                  }`}
                >
                  <div className="w-16 h-16 bg-[#9ECFD4] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#70B2B2] transition-colors">
                    <svg className="w-8 h-8 text-[#70B2B2] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#014b43] text-center">Teacher</h3>
                  <p className="text-gray-600 text-center mt-2 text-sm">Create exams and grade students</p>
                </motion.button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#016B61]"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                    placeholder="1234567890"
                  />
                </div>

                {userType === 'student' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">Student ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                        placeholder="STU001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">Course</label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                        placeholder="Computer Science"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">Teacher ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.teacher_id}
                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                        placeholder="TCH001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#9ECFD4] bg-white/60 focus:ring-2 focus:ring-[#016B61] focus:border-transparent transition-all outline-none"
                        placeholder="Computer Science"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border-2 border-[#9ECFD4] text-[#014b43] font-semibold rounded-xl hover:bg-[#E5E9C5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-[#016B61] hover:bg-[#014b43] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-[#016B61] hover:text-[#014b43] font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}