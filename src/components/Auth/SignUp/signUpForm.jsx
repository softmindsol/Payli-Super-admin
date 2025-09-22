import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { IoCaretDownSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Divider from "@/components/Divider";
import SocialLogin from "@/components/SocialLogin";
import { Input } from "@/components/ui/input";
import { LogoBlue } from "@/assets/svgs";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    navigate("/pos");
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full">
        <div className="flex justify-center pb-6">
          <img
            className="max-w-[114px] w-full block lg:hidden"
            src={LogoBlue}
            alt=""
          />
        </div>

        {/* Header */}
        <div className="px-4 xl:px-8 lg:pb-6 pb-3">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
            Let&apos;s get started
          </h1>
          <p className="text-[#545454] text-sm lg:text-base font-medium">
            Please fill in this form to create your account.
          </p>
        </div>

        {/* Form */}
        <div className="px-4 xl:px-8 pb-8">
          <div className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 gap-2">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
                  First Name
                </label>
                <Input
                  placeholder="first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
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
                  type="text"
                  placeholder="last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
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
                  placeholder="example@gmail.com"
                  value={formData.email}
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
                  placeholder="+0123 456 789"
                  value={formData.phone}
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
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
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
                    // placeholder="••••••••"
                    placeholder="confirm password"
                    value={formData.confirmPassword}
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

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
                Company Name
              </label>
              <Input
                placeholder="company name"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className={
                  errors.companyName
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-blue-300 text-sm"
                }
              />
              {errors.companyName && (
                <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Business Region */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
                Business Region
              </label>
              <div className="relative">
                <select
                  value={formData.businessRegion}
                  onChange={(e) =>
                    handleInputChange("businessRegion", e.target.value)
                  }
                  className="appearance-none w-full px-4 py-2.5 text-sm pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a region</option>
                  <option value="Belgium/Netherlands">
                    Belgium/Netherlands
                  </option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
                <IoCaretDownSharp className="absolute right-4 top-1/2 transform -translate-y-1/2 size-4 text-black pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              type="submit"
              className="w-full flex items-center justify-center px-4 lg:py-5 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
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
        </div>

        {/* Sign Up Link */}
        <div className="flex items-end justify-center">
          <p className="text-center text-sm text-black lg:mt-5">
            Don&apos;t have an account?{" "}
            <button className="text-sm lg:text-base text-[#1D50AB] hover:text-blue-500 hover:underline font-semibold">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
