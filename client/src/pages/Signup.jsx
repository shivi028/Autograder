// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// import { Button } from "../components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Navbar } from "../components/Navbar";
// import { GraduationCap, User, Mail, Lock, UserCheck } from "lucide-react";

// export default function Signup() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role,
//         },
//       },
//     });

//     if (error) {
//       alert("Signup failed: " + error.message);
//       return;
//     }

//     const user = data.user;
//     if (!user) {
//       alert("Signup failed: No user returned");
//       return;
//     }

//     // Insert into respective table
//     if (role === "student") {
//       await supabase.from("students").insert([
//         {
//           student_id: `STU-${user.id.slice(0, 8)}`, // generate simple unique student_id
//           full_name: fullName,
//           email,
//         },
//       ]);
//     } else if (role === "teacher") {
//       await supabase.from("teachers").insert([
//         {
//           teacher_id: `TEA-${user.id.slice(0, 8)}`, // generate simple unique teacher_id
//           full_name: fullName,
//           email,
//         },
//       ]);
//     }

//     alert("Signup successful! Please login.");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="p-3 bg-primary rounded-xl">
//                 <GraduationCap className="h-8 w-8 text-primary-foreground" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
//             <p className="text-muted-foreground">
//               Join AutoGrader and revolutionize your educational experience
//             </p>
//           </div>

//           {/* Signup Form */}
//           <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
//               <CardDescription className="text-center">
//                 Enter your information to create your account
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSignup} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="fullName"
//                       type="text"
//                       placeholder="Enter your full name"
//                       className="pl-10"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       className="pl-10"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="Create a password"
//                       className="pl-10"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="role">Role</Label>
//                   <Select value={role} onValueChange={(value) => setRole(value)}>
//                     <SelectTrigger>
//                       <div className="flex items-center">
//                         <UserCheck className="h-4 w-4 text-muted-foreground mr-2" />
//                         <SelectValue placeholder="Select your role" />
//                       </div>
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="student">Student</SelectItem>
//                       <SelectItem value="teacher">Teacher</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button type="submit" className="w-full" size="lg">
//                   Create Account
//                 </Button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-sm text-muted-foreground">
//                   Already have an account?{" "}
//                   <a href="/login" className="text-primary hover:underline font-medium">
//                     Sign in
//                   </a>
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Background decoration */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
//       </div>
//     </div>
//   );
// }




import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
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
    setLoading(true);
    
    console.log('🚀 Submitting registration...', { ...formData, user_type: userType });
    
    try {
      // Prepare data according to backend requirements
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        user_type: userType,
        phone: formData.phone || null
      };

      // Add user-type specific fields
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
      
      // Navigate based on user role
      if (data.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (data.user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Your Account</h2>

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
                  className="p-8 border-2 border-indigo-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                    <svg className="w-8 h-8 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center">Student</h3>
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
                  className="p-8 border-2 border-purple-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                    <svg className="w-8 h-8 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center">Teacher</h3>
                  <p className="text-gray-600 text-center mt-2 text-sm">Create exams and grade students</p>
                </motion.button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="1234567890"
                  />
                </div>

                {userType === 'student' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="STU001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="Computer Science"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teacher ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.teacher_id}
                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="TCH001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
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
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}