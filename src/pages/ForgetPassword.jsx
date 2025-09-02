import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/login`;
      await sendPasswordResetEmail(auth, email, {
        url: redirectUrl,
      });

      toast.success(
        "If an account exists with this email, a password reset link has been sent. If you don't see it, check your spam folder."
      );

      setEmailSent(true);
      // Clear the form
      setEmail("");
    } catch (error) {
      toast.success(
        "If an account exists with this email, a password reset link has been sent. If you don't see it, check your spam folder."
      );

      setEmailSent(true);
      // Clear the form even on error for consistency
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#2D2D34] mb-2">
                Check Your Email
              </h2>
              <p className="text-[#6B6B70] text-sm leading-relaxed">
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions to reset your
                password.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#00BFA6] text-white py-3 px-4 rounded-xl hover:bg-[#00BFA6]/90 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium cursor-pointer"
              >
                Back to Login
              </button>
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-[#F6F5F3] hover:bg-[#DADADA] text-[#2D2D34] py-3 px-4 rounded-xl border border-[#DADADA] focus:outline-none focus:ring-2 focus:ring-[#DADADA] transition-all duration-200 font-medium cursor-pointer"
              >
                Send Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8E6DE9] to-[#00BFA6] rounded-2xl shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#2D2D34]">
                Reset Password
              </h1>
              <p className="text-lg text-[#6B6B70]">
                Get back to your adventures
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#F6F5F3] to-white px-8 py-6 border-b border-[#DADADA]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2D2D34]">
                Password Recovery
              </h2>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F6F5F3] hover:bg-[#DADADA] text-[#6B6B70] hover:text-[#2D2D34] rounded-lg transition-all duration-200 cursor-pointer"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Description */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#8E6DE9] rounded-lg">
                  <FaShieldAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D2D34]">
                  Secure Password Reset
                </h3>
              </div>
              <p className="text-[#6B6B70] text-sm leading-relaxed">
                Enter your email address and we'll send you a secure link to
                reset your password. This link will expire in 1 hour for your
                security.
              </p>
            </div>

            {/* Email Input Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#00BFA6] rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D2D34]">
                  Email Address
                </h3>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2D2D34] mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] placeholder-[#6B6B70] bg-white"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8E6DE9] text-white py-4 px-6 rounded-xl hover:bg-[#8E6DE9]/90 focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <FaShieldAlt className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </div>
              )}
            </button>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t border-[#DADADA]">
              <p className="text-xs text-[#6B6B70] mb-3">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#FF5E5B] hover:text-[#FF5E5B]/90 font-medium ml-1 transition-colors duration-200 cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
              <p className="text-xs text-[#6B6B70]">
                Remember your password?
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#00BFA6] hover:text-[#00BFA6]/90 font-medium ml-1 transition-colors duration-200 cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
