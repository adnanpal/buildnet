import { useState } from 'react';
import { Lightbulb, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from 'lucide-react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  // OAuth Login Handler - Works in both dev and production
  const handleOAuthLogin = async (provider: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return;

    try {
      // For OAuth, we use authenticateWithRedirect which handles both login AND signup
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/", // Always go to root, App.tsx handles routing
      });
    } catch (err: any) {
      console.error("OAuth Failed:", err);
      alert("Failed to authenticate. Please try again.");
    }
  };

  // Email/Password Login Handler
  const handleLogin = async (email: string, password: string) => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      const result = await signInAttempt.attemptFirstFactor({
        strategy: "password",
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        // Navigate to root - App.tsx will handle routing based on profile completion
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login Failed:", err.errors?.[0]?.message);
      alert(err.errors?.[0]?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
        }
      `}</style>

      {/* Background decorations */}
      <div className="bg-circle w-64 h-64 bg-purple-300 top-10 right-10 absolute"></div>
      <div className="bg-circle w-96 h-96 bg-blue-300 bottom-10 left-10 absolute"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center animate-slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-xl float-animation">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to BuildNet</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin("oauth_google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin("oauth_github")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(formData.email, formData.password);
            }}
            className="space-y-5"
          >
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button type="button" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;