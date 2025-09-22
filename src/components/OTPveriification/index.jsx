import { InputOTPPattern } from "../inputOTP";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoBlue } from "@/assets/svgs";

const OTPVerification = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const handleBack = () => {
    navigate("/reset-password"); // Go back to the previous page
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Handle successful login here
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    navigate("/create-new-password");
  };
  return (
    <div className="container mx-auto">
      <div className="absolute top-28 xsm:left-36 xs:left-28 left-24">
        <img
          className="max-w-[136px] w-full block md:hidden"
          src={LogoBlue}
          alt="Payli-Logo"
        />
      </div>

      <button
        onClick={handleBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute lg:top-12 top-56 md:px-8 px-5 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="xl:max-w-2xl lg:max-w-xl md:max-w-md flex flex-col items-start justify-center h-full md:px-9 px-5">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#2E2E2E] font-bold pb-1">
          Two-Step Verification
        </h1>
        <p className="lg:text-base text-sm text-[#545454] font-medium">
          Please enter the OTP to verify your account. A code has been sent to:
        </p>
        <span className="lg:text-base text-sm text-[#1D50AB] font-bold cursor-pointer hover:underline">
          example@gmail.com
        </span>
        <div className="lg:my-14 my-6">
          <InputOTPPattern />
        </div>
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 lg:py-6 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 mr-1 border-b-2 border-black"></div>
            </>
          ) : (
            <div className="flex items-center">
              Continue
              <ArrowRight className="ml-2 mt-0.5 size-4" />
            </div>
          )}
        </Button>
        <div className="flex items-center justify-center w-full">
          <p className="text-center text-sm text-gray-600 lg:mt-8 mt-4">
            Don&apos;t get the code?{" "}
            <button className="text-base text-[#1D50AB] hover:text-blue-500 hover:underline font-semibold">
              Resend It
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
