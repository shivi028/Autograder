import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home"
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard"
import {ROUTES} from "./constants/routes"
import MainLayout from "./layouts/MainLayout";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <p>Access denied</p>;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
         <Toaster position="top-right" />
        <Routes>
          {/* Default route */}
           <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* Auth routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

          {/* Student dashboard */}
          <Route
            path={ROUTES.STUDENT_DASHBOARD}
            element={
                <StudentDashboard />
            }
          />

          {/* Teacher dashboard */}
          <Route
            path={ROUTES.TEACHER_DASHBOARD}
            element={
                <TeacherDashboard />
            }
          />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}