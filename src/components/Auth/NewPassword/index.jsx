import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { LogoBlue } from "@/assets/svgs";
import { CgSpinnerAlt } from "react-icons/cg";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (pwd) => {
    const errors = {};

    if (pwd.length < 8) {
      errors.length = "Password must be at least 8 characters long";
    }

    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.lowercase = "Must contain at least one lowercase letter";
    }

    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.uppercase = "Must contain at least one uppercase letter";
    }

    if (!/(?=.*\d)/.test(pwd)) {
      errors.number = "Must contain at least one number";
    }

    if (/\s/.test(pwd)) {
      errors.space = "Password must not contain spaces";
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const passwordErrors = validatePassword(newPassword);
      setErrors((prev) => ({ ...prev, password: passwordErrors }));
    } else {
      setErrors((prev) => ({ ...prev, password: {} }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword && password && newConfirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, confirm: null }));
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    // Validate password
    if (!password) {
      newErrors.password = { required: "Password is required" };
    } else {
      const passwordErrors = validatePassword(password);
      if (Object.keys(passwordErrors).length > 0) {
        newErrors.password = passwordErrors;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    // If any errors, set them and exit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No errors: proceed with async action
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async task
      navigate("/password-reset-successful");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const passwordErrors = validatePassword(password);
    return (
      password &&
      confirmPassword &&
      Object.keys(passwordErrors).length === 0 &&
      password === confirmPassword
    );
  };
  const handleBack = () => {
    navigate("/otp-verification"); // Go back to the previous page
  };

  return (
    <div>
      <div className="absolute top-20 xsm:left-36 xs:left-28 left-20">
        <img
          className="max-w-[136px] w-full block md:hidden"
          src={LogoBlue}
          alt="Payli-Logo"
        />
      </div>

      <button
        onClick={handleBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute lg:top-12 top-52 px-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full">
          <div className="lg:mb-12 mb-6">
            <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
              Create A New Password
            </h1>
            <p className="text-[#545454] lg:text-base text-sm !leading-tight font-medium max-w-md w-full">
              Please choose a password that hasn’t been used before. Must be at
              least 8 characters.{" "}
            </p>
          </div>
          <div className="lg:space-y-6 space-y-3">
            {/* Set New Password */}
            <div>
              <label className="block text-base font-bold text-[#2E2E2E] mb-1">
                Set New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full px-3 border rounded-[6px] shadow-sm placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Password validation errors */}
              {errors.password && Object.keys(errors.password).length > 0 && (
                <div className="mt-2 space-y-1">
                  {Object.values(errors.password).map((error, index) => (
                    <p
                      key={index}
                      className="text-[13px] text-red-600 font-medium flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {error}
                    </p>
                  ))}
                </div>
              )}
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => {
                      const passwordErrors = validatePassword(password);
                      const strength = 4 - Object.keys(passwordErrors).length;
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= strength
                              ? strength <= 1
                                ? "bg-red-500"
                                : strength <= 2
                                ? "bg-yellow-400"
                                : strength <= 3
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    Password strength:{" "}
                    {(() => {
                      const strength =
                        4 - Object.keys(validatePassword(password)).length;
                      return strength <= 1
                        ? "Weak"
                        : strength <= 2
                        ? "Fair"
                        : strength <= 3
                        ? "Good"
                        : "Strong";
                    })()}
                  </p>
                </div>
              )}
            </div>
            {/* Confirm New Password */}
            <div>
              <label className="block text-base font-bold text-[#2E2E2E] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="block w-full px-3 border rounded-[6px] shadow-sm placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p className="mt-2 text-[13px] text-red-600 font-medium flex items-center">
                  <span className="size-[5px] bg-red-600 rounded-full mr-1"></span>
                  {errors.confirm}
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-2 text-[13px] font-medium text-green-600 flex items-center">
                  <span className="size-[5px] bg-green-600 rounded-full mr-1"></span>
                  Passwords match!
                </p>
              )}
            </div>
            {/* Continue Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-3 px-4 rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isFormValid()
                  ? "w-full flex items-center justify-center px-4 lg:py-6 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
                  : "bg-gray-300 text-gray-800 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 mr-1 border-b-2 border-black"></div>
                </>
              ) : (
                <div className="flex items-center">
                  Continue
                  <ArrowRight className="ml-2 size-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
