import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);

    try {
      // First, check if email exists in students or teachers table
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('email')
        .eq('email', email)
        .single();

      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('email')
        .eq('email', email)
        .single();

      // If email doesn't exist in either table
      if (!studentData && !teacherData) {
        setLoading(false);
        toast.error("No account found with this email address.");
        return;
      }

      // Email exists, proceed with password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for the reset link.");
        setEmail(""); // Clear email field after success
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      console.error("Reset password error:", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eeefed] px-4">
      <Card className="w-full max-w-md shadow-lg border-[#9ECFD4]">
        <CardHeader>
          <CardTitle className="text-[#014b43]">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#014b43] mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#9ECFD4] focus:ring-[#016B61]"
              />
            </div>
            <Button
              className="w-full bg-[#016B61] hover:bg-[#014b43]"
              onClick={handleReset}
              disabled={loading || !email}
            >
              {loading ? <Loading message="Sending..."/> : "Send Reset Link"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}