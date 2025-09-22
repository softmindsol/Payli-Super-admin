import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IoCaretDownSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SignupPOS = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/sign-up"); // Go back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    navigate("/subscription-plans");
  };
  return (
    <div className="flex flex-col justify-center px-4 xl:px-8">
      <button
        onClick={handleBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute lg:top-12 top-56 md:px-8 px-5 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="flex flex-col justify-center px-4 xl:px-8">
        <div className="lg:pb-6 pb-3">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
            Hey there, what brings you here today?
          </h1>
          <p className="text-[#545454] text-sm lg:text-base font-medium">
            Help us tailor the best experience for you
          </p>
        </div>
        <div className="lg:space-y-3.5 space-y-2 mb-8">
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2.5 text-sm pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200">
              <option value="">Select Type</option>
              <option value="Belgium/Netherlands">POS</option>
              <option value="Germany">Webshop</option>
              <option value="France">Both</option>
            </select>
            <IoCaretDownSharp className="absolute right-4 top-1/2 transform -translate-y-1/2 size-4 text-black pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2.5 text-sm pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200">
              <option value="">Business Type</option>
              <option value="Belgium/Netherlands">Retail</option>
              <option value="Germany">Restaurant</option>
            </select>
            <IoCaretDownSharp className="absolute right-4 top-1/2 transform -translate-y-1/2 size-4 text-black pointer-events-none" />
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default SignupPOS;
