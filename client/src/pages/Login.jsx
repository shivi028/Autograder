// import React, { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Navbar } from "../components/navbar";
// import { GraduationCap, Mail, Lock } from "lucide-react";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();

//   //   const { data, error } = await supabase.auth.signInWithPassword({
//   //     email,
//   //     password,
//   //   });

//   //   if (error) {
//   //     alert("Login failed: " + error.message);
//   //     return;
//   //   }

//   //   const user = data.user;
//   //   console.log("User after login:", user);

//   //   if (user.user_metadata.role === "student") {
//   //     navigate("/dashboard/student");
//   //   } else if (user.user_metadata.role === "teacher") {
//   //     navigate("/dashboard/teacher");
//   //   } else {
//   //     alert("No role assigned. Contact admin.");
//   //   }
//   // };

//   const handleLogin = async (e) => {
//   e.preventDefault();

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     alert("Login failed: " + error.message);
//     return;
//   }

//   const user = data.user;
//   console.log("User after login:", user);

//   if (user.user_metadata.role === "student") {
//     navigate("/dashboard/student");
//   } else if (user.user_metadata.role === "teacher") {
//     navigate("/dashboard/teacher");
//   } else {
//     alert("No role assigned. Contact admin.");
//   }
// };


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
//             <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
//             <p className="text-muted-foreground">
//               Sign in to your AutoGrader account
//             </p>
//           </div>

//           {/* Login Form */}
//           <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl text-center">Sign In</CardTitle>
//               <CardDescription className="text-center">
//                 Enter your credentials to access your account
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleLogin} className="space-y-4">
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
//                       placeholder="Enter your password"
//                       className="pl-10"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <p className="text-red-500 text-sm font-medium">{error}</p>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-primary hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   size="lg"
//                   disabled={loading}
//                 >
//                   {loading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-sm text-muted-foreground">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/signup"
//                     className="text-primary hover:underline font-medium"
//                   >
//                     Sign up
//                   </Link>
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(data.user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white/50"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
