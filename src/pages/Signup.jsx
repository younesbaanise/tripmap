import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGlobeAmericas,
  FaMapMarkedAlt,
  FaCamera,
  FaCalendarAlt,
} from "react-icons/fa";
import tripmapLogo from "../assets/tripmap-logo.png";

// Fallback for mobile/tablet compatibility
const logoPath = tripmapLogo || "/src/assets/tripmap-logo.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill out all fields.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email address.");
      return false;
    }

    // Check password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const redirectUrl = `${window.location.origin}/login`;
      await sendEmailVerification(userCredential.user, {
        url: redirectUrl,
      });

      // Show success message
      toast.success(
        "Signup successful! Verification email sent. If you don't see it, check your spam folder."
      );

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Handle specific Firebase errors with meaningful messages
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use.");
      } else if (error.code === "auth/network-request-failed") {
        toast.error(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many signup attempts. Please try again later.");
      } else {
        toast.error("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Google accounts are automatically verified
      toast.success("Signup successful! Welcome to TripMap.");

      // Use setTimeout to ensure the auth state has time to update
      setTimeout(() => {
        navigate("/trips");
      }, 100);
    } catch (error) {
      console.error("Google sign-up error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-up cancelled.");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups for this site.");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        toast.error(
          "An account already exists with the same email address but different sign-in credentials."
        );
      } else {
        toast.error(
          "An error occurred during Google sign-up. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="flex min-h-screen">
        {/* Left Side - Travel Illustration & App Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00BFA6] via-[#8E6DE9] to-[#FF5E5B] text-white p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
          </div>

          <div className="max-w-lg mx-auto text-center relative z-10">
            {/* App Logo/Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center mb-6">
                <img
                  src={logoPath}
                  alt="TripMap Logo"
                  className="w-20 h-20 object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "/src/assets/tripmap-logo.png";
                  }}
                />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">TripMap</h1>
            </div>

            {/* App Description */}
            <p className="text-xl font-medium mb-8 text-white/90">
              Share your travel memories & plan future trips
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 border border-white/30">
                  <FaMapMarkedAlt className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/90">Map Your Trips</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 border border-white/30">
                  <FaCamera className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/90">Share Memories</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 border border-white/30">
                  <FaCalendarAlt className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/90">Plan Adventures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <img
                  src={logoPath}
                  alt="TripMap Logo"
                  className="w-16 h-16 object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "/src/assets/tripmap-logo.png";
                  }}
                />
              </div>
              <h1 className="text-3xl font-bold text-[#2D2D34] mb-2">
                TripMap
              </h1>
              <p className="text-[#6B6B70]">
                Share your travel memories & plan future trips
              </p>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#2D2D34] mb-2">
                Start Your Journey
              </h2>
              <p className="text-[#6B6B70]">
                Create an account to begin mapping your adventures
              </p>
            </div>

            {/* Sign Up Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-[#6B6B70]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={googleLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-[#DADADA] rounded-lg placeholder-[#6B6B70] text-[#2D2D34] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:border-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#6B6B70]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={googleLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-[#DADADA] rounded-lg placeholder-[#6B6B70] text-[#2D2D34] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:border-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#6B6B70]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={googleLoading}
                  className="block w-full pl-10 pr-12 py-3 border border-[#DADADA] rounded-lg placeholder-[#6B6B70] text-[#2D2D34] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:border-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-[#6B6B70] hover:text-[#2D2D34] transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-[#6B6B70] hover:text-[#2D2D34] transition-colors" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#6B6B70]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={googleLoading}
                  className="block w-full pl-10 pr-12 py-3 border border-[#DADADA] rounded-lg placeholder-[#6B6B70] text-[#2D2D34] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:border-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-[#6B6B70] hover:text-[#2D2D34] transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-[#6B6B70] hover:text-[#2D2D34] transition-colors" />
                  )}
                </button>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-[#FF5E5B] hover:bg-[#FF5E5B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DADADA]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F6F5F3] text-[#6B6B70]">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-[#DADADA] rounded-lg shadow-sm text-sm font-medium text-[#2D2D34] bg-white hover:bg-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E5B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {googleLoading ? "Signing up..." : "Continue with Google"}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-[#6B6B70]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-[#FF5E5B] hover:text-[#FF5E5B]/80 transition-colors cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
