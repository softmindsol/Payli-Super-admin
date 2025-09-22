import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoBlue } from "@/assets/svgs";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate("/"); // Go back to the previous page
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
    navigate("/otp-verification");
  };

  return (
    <div className="container mx-auto">
      <div className="absolute top-32 xsm:left-36 xs:left-28 left-24">
        <img
          className="max-w-[136px] w-full block md:hidden"
          src={LogoBlue}
          alt="Payli-Logo"
        />
      </div>

      <button
        onClick={handleBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute lg:top-12 top-64 md:px-8 px-4 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <form onSubmit={handleSubmit}>
        <div className="min-h-screen flex items-center md:p-8 p-4">
          <div className="w-full">
            {/* Form Container */}
            <div className="xl:max-w-2xl lg:max-w-xl md:max-w-md ">
              {/* Header */}
              <div className="lg:mb-20 md:mb-10 mb-6">
                <h1 className="xl:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
                  Reset Password
                </h1>
                <p className="text-#545454 lg:text-base text-sm font-medium !leading-tight">
                  We&apos;ll send you an email with a link to reset the password
                  to your account
                </p>
              </div>
              {/* Form */}
              <div className="lg:space-y-6 space-y-3">
                <div className="lg:mb-6 mb-3">
                  <label
                    htmlFor="email"
                    className="block lg:text-base text-sm font-bold text-[#2E2E2E] mb-1"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full px-3 border rounded-[6px] shadow-sm placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors placeholder:text-sm placeholder:font-medium`}
                    placeholder="Enter your email"
                  />
                </div>
                {/* Continue Button */}
                {/* <Link to="/otp-verification"> */}
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
                      <ArrowRight className="ml-2 size-4" />
                    </div>
                  )}
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
