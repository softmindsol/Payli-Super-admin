import { useState } from "react";
import { ArrowRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  resetOnboarding,
} from "../../store/features/onboarding/onboarding.slice";
import Divider from "../Divider";
import SocialLogin from "../SocialLogin";
import { Link } from "react-router-dom";

const UserInfoStep = ({ onNext }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.onboarding);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user has any existing data to show clear option
  const hasExistingData = user.firstName || user.email;

  const handleClearProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all progress and start over?"
      )
    ) {
      dispatch(resetOnboarding());
    }
  };

  const handleInputChange = (field, value) => {
    // Update user fields
    dispatch(updateUser({ [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!user.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!user.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!user.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!user.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!user.confirmPassword?.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col justify-center px-4 xl:px-8 mt-10">
      <div className="lg:pb-6 pb-3 relative">
        <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
          Create Your Account
        </h1>
        <p className="text-[#545454] text-sm lg:text-base font-medium">
          Let&apos;s get started with your business journey
        </p>

        {/* Clear Progress Button */}
        {hasExistingData && (
          <button
            onClick={handleClearProgress}
            className="absolute top-0 right-0 flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Start Over
          </button>
        )}
      </div>

      <div className="lg:space-y-3.5 space-y-2">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              First Name
            </label>
            <Input
              placeholder="first name"
              value={user.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={
                errors.firstName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-300 text-sm"
              }
            />
            {errors.firstName && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              Last Name
            </label>
            <Input
              placeholder="last name"
              value={user.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={
                errors.lastName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-300 text-sm"
              }
            />
            {errors.lastName && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={user.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-300 text-sm"
              }
            />
            {errors.email && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={user.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={
                errors.phone
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-300 text-sm"
              }
            />
            {errors.phone && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 gap-2">
          <div className="relative">
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="enter password"
                value={user.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={
                  errors.password
                    ? "border-red-500 pr-10"
                    : "focus:ring-2 focus:ring-blue-300 pr-10 text-sm"
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                value={user.confirmPassword || ""}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={
                  errors.confirmPassword
                    ? "border-red-500 pr-10"
                    : "focus:ring-2 focus:ring-blue-300 pr-10 text-sm"
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full flex items-center justify-center px-4 lg:py-5 !mt-8 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all "
        >
          <div className="flex items-center">
            Continue
            <ArrowRight className="ml-2 size-4" />
          </div>
        </Button>
        {/* Divider */}
        <div>
          <Divider />
        </div>

        {/* Social Login */}
        <SocialLogin />
      </div>
      <div className="flex items-end justify-center mb-5">
        <p className="text-center text-sm text-black lg:mt-5">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-sm lg:text-base text-[#1D50AB] hover:text-blue-500 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserInfoStep;
