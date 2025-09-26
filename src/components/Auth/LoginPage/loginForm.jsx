import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

import { LogoBlue } from "../../../assets/svgs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import SocialLogin from "../../../components/SocialLogin";
import Divider from "../../../components/Divider";
import RememberPassword from "../RememberPassword";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login attempt:", { ...formData, rememberMe });
      // Handle successful login here
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center w-full h-screen py-6">
      <div className="flex items-center justify-start w-full">
        <div className="w-full space-y-8 xl:max-w-2xl lg:max-w-xl md:max-w-md">
          <div className="flex justify-center">
            <img
              className="max-w-[124px] w-full block md:hidden"
              src={LogoBlue}
              alt=""
            />
          </div>

          {/* Header */}
          <div className="text-start lg:mb-16">
            <h2 className="mb-1 text-3xl font-bold lg:text-4xl">
              Login your account
            </h2>
            <p className="text-sm leading-tight text-primary">
              Enter your valid email address and password to login your account.{" "}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block lg:text-base text-sm font-bold text-[#2E2E2E]"
              >
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full px-3 border rounded-[6px] shadow-sm placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
                    errors.email ? "" : "border-[#EFEFEF]"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm font-bold text-red-600">{errors.email}</p>
              )}
            </div>
            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block lg:text-base text-sm font-bold text-[#2E2E2E]"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-3 border rounded-[6px] shadow-sm placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
                    errors.password ? "" : "border-[#EFEFEF]"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm font-bold text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <RememberPassword />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 lg:py-6 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-1 border-b-2 border-black rounded-full animate-spin"></div>
                  <span className="text-black">Logging In...</span>
                </>
              ) : (
                <div className="flex items-center">
                  Login
                  <ArrowRight className="ml-2 mt-0.5 size-4" />
                </div>
              )}
            </Button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
