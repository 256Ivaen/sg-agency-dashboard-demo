"use client";

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail, EyeOff, Eye, X } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { PiTiktokLogoLight } from "react-icons/pi";
import { SlSocialFacebook } from "react-icons/sl";
import { PiYoutubeLogo } from "react-icons/pi";
import { assets } from "../assets/assets";
import { mockAuthUser } from "../assets/mock.js";

const ForgotPasswordModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (email !== mockAuthUser.email) {
      toast.error("Email not found");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Reset code sent to your email (Use code: 1234)");
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (otp !== "1234") {
      toast.error("Invalid reset code");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      mockAuthUser.password = newPassword;
      toast.success("Password reset successfully!");
      onComplete();
      onClose();
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="forgot-password-title">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 id="forgot-password-title" className="text-xl font-semibold">
            {step === 1 ? "Reset Password" : "Enter Reset Code"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-xs text-gray-600">
              {step === 1 
                ? "Enter your email to receive a reset code" 
                : "Enter the code sent to your email and your new password"
              }
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all"
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition text-xs"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-secondary font-medium py-3 rounded-lg transition disabled:opacity-50 text-xs"
                >
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs text-center tracking-widest transition-all"
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                  disabled={loading}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all"
                  placeholder="New Password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all"
                  placeholder="Confirm New Password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition text-xs"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-secondary font-medium py-3 rounded-lg transition disabled:opacity-50 text-xs"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    setSubmitted(true);

    if (valid) {
      setLoading(true);
      
      setTimeout(() => {
        if (email === mockAuthUser.email && password === mockAuthUser.password) {
          localStorage.setItem('name', mockAuthUser.username);
          localStorage.setItem('email', mockAuthUser.email);
          localStorage.setItem('role', mockAuthUser.role);
          localStorage.setItem('isLoggedIn', 'true');
          
          toast.success('Login successful!');
          navigate('/');
          
          setEmail("");
          setPassword("");
          setSubmitted(false);
        } else {
          toast.error('Invalid credentials. Please check your email and password.');
        }
        
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <style jsx>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar { 
          display: none;
        }
      `}</style>

      {/* Desktop Layout - 80vh and 80vw with Shadow */}
      <div className="min-h-screen w-full hidden xl:flex items-center justify-center bg-gray-100">
        <div className="h-screen w-screen flex overflow-hidden bg-white">
          
          {/* LEFT SIDE - Image Section */}
          <div className="w-1/2 relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${assets.banner})` }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content - CENTERED SOCIALS AT BOTTOM */}
            <div className="relative z-20 h-full flex flex-col justify-end items-center pb-12">
              <div className="text-white text-center">
                <h2 className="text-sm font-medium mb-6">Follow us on social media</h2>
                
                <div className="flex items-center justify-center gap-4">
                  <a href="https://www.instagram.com/socialgems.ug/" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <FaInstagram className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://www.tiktok.com/@social_gems_" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <PiTiktokLogoLight className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://x.com/socialgems_ug" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <FaXTwitter className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://www.youtube.com/@socialgems.africa" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <PiYoutubeLogo className="w-5 h-5 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form Section - UPDATED TO BE CENTERED */}
          <div className="w-1/2 bg-white flex flex-col h-full">
            {/* Centered Content Container */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm px-8">
                {/* Header */}
                <div className="flex-shrink-0 mb-8">
                  <div className="flex justify-center mb-6">
                    <img
                      src={assets.MainLogo}
                      alt="Social Gems"
                      className="h-12 w-fit object-contain"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-gray-600 text-xs">
                      Sign in to your account
                    </p>
                  </div>
                </div>

                {/* Form Content */}
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleLogin}
                  noValidate
                >
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="agency@socialgems.me"
                      className={`w-full px-4 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                        emailError ? "border-red-500" : ""
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!emailError}
                      aria-describedby="email-error"
                      disabled={loading}
                    />
                    {emailError && (
                      <p id="email-error" className="text-red-500 text-xs mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        className={`w-full pr-10 py-3 px-4 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                          passwordError ? "border-red-500" : ""
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!passwordError}
                        aria-describedby="password-error"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p id="password-error" className="text-red-500 text-xs mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="text-xs text-secondary hover:underline font-medium"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-secondary font-medium py-3 rounded-lg transition disabled:opacity-50 text-xs hover:bg-primary"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout - Slightly Smaller but Full Coverage */}
      <div className="min-h-screen w-full lg:flex hidden xl:hidden bg-gray-50">
        <div className="w-full h-screen flex shadow-xl">
          
          {/* LEFT SIDE - Image Section */}
          <div className="w-1/2 relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${assets.banner})` }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Content - CENTERED SOCIALS AT BOTTOM */}
            <div className="relative z-20 h-full flex flex-col justify-end items-center pb-12">
              <div className="text-white text-center">
                <h2 className="text-sm font-medium mb-6">Follow us on social media</h2>
                
                <div className="flex items-center justify-center gap-4">
                  <a href="https://www.instagram.com/socialgems.ug/" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <FaInstagram className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://www.tiktok.com/@social_gems_" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <PiTiktokLogoLight className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://x.com/socialgems_ug" className="w-12 h-12 bg-transparent hover:bg-secondary rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <FaXTwitter className="w-5 h-5 text-primary" />
                  </a>
                  <a href="https://www.youtube.com/@socialgems.africa" className="w-12 h-12 bg-transparent hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-primary">
                    <PiYoutubeLogo className="w-5 h-5 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form Section */}
          <div className="w-1/2 bg-white flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 p-6 pb-4">
              <div className="flex justify-center mb-4">
                {/* Clean logo without background */}
                <img
                  src={assets.LogoIcon}
                  alt="Social Gems"
                  className="h-10 w-10 object-contain"
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-xs">
                  Sign in to your account
                </p>
              </div>
            </div>

            {/* Form Content - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-6 scrollbar-none">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleLogin}
                noValidate
              >
                <div>
                  <label htmlFor="email-tablet" className="block text-xs font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email-tablet"
                    placeholder="agency@socialgems.me"
                    className={`w-full px-4 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                      emailError ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!emailError}
                    aria-describedby="email-error-tablet"
                    disabled={loading}
                  />
                  {emailError && (
                    <p id="email-error-tablet" className="text-red-500 text-xs mt-1">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password-tablet" className="block text-xs font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password-tablet"
                      placeholder="Enter your password"
                      className={`w-full pr-10 py-3 px-4 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!passwordError}
                      aria-describedby="password-error-tablet"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="password-error-tablet" className="text-red-500 text-xs mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-secondary font-medium py-3 rounded-lg transition disabled:opacity-50 text-xs hover:bg-primary"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Screen */}
      <div className="min-h-screen w-full flex flex-col lg:hidden bg-gray-50">
        <div className="w-full h-screen flex flex-col">
          {/* Mobile Logo Section */}
          <div className="flex-shrink-0 bg-primary py-8 px-4 text-center">
            <img
              src={assets.MainLogo}
              alt="Social Gems Logo"
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>

          {/* Mobile Form Section */}
          <div className="flex-1 bg-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-6 pb-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-xs">
                  Sign in to your account
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-none">
              <form
                className="flex flex-col gap-5 mb-8"
                onSubmit={handleLogin}
                noValidate
              >
                <div>
                  <label htmlFor="email-mobile" className="block text-xs font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email-mobile"
                    placeholder="agency@socialgems.me"
                    className={`w-full px-4 py-3 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                      emailError ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!emailError}
                    aria-describedby="email-error-mobile"
                    disabled={loading}
                  />
                  {emailError && (
                    <p id="email-error-mobile" className="text-red-500 text-xs mt-1">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password-mobile" className="block text-xs font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password-mobile"
                      placeholder="Enter your password"
                      className={`w-full pr-10 py-3 px-4 rounded-lg border-0 outline-0 bg-gray-200 focus:bg-white focus:border focus:border-primary text-black text-xs transition-all ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!passwordError}
                      aria-describedby="password-error-mobile"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="password-error-mobile" className="text-red-500 text-xs mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-secondary font-medium py-3 rounded-lg transition disabled:opacity-50 text-xs"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              {/* Mobile Social Media Links */}
              <div className="text-center">
                <p className="text-sm opacity-80 mb-4 text-gray-600">Follow us on social media</p>
                <div className="flex items-center justify-center gap-4">
                  <a href="https://www.instagram.com/socialgems.ug/" className="w-12 h-12 bg-transparent hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-secondary">
                    <FaInstagram className="w-5 h-5 text-secondary" />
                  </a>
                  <a href="https://www.tiktok.com/@social_gems_" className="w-12 h-12 bg-transparent hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-secondary">
                    <PiTiktokLogoLight className="w-5 h-5 text-secondary" />
                  </a>
                  <a href="https://x.com/socialgems_ug" className="w-12 h-12 bg-transparent hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-secondary">
                    <FaXTwitter className="w-5 h-5 text-secondary" />
                  </a>
                  <a href="https://www.youtube.com/@socialgems.africa" className="w-12 h-12 bg-transparent hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-secondary">
                    <PiYoutubeLogo className="w-5 h-5 text-secondary" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onComplete={() => {
          toast.success("You can now sign in with your new password");
        }}
      />
    </>
  );
};

export default Login;