import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IoCaretDownSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBusiness,
  updateCompany,
} from "../../store/features/onboarding/onboarding.slice";
import { useState } from "react";

const BusinessInfoStep = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const { business, company } = useSelector((state) => state.onboarding);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    // Update business or company based on field
    if (["companyName", "businessRegion"].includes(field)) {
      dispatch(updateCompany({ [field]: value }));
    } else {
      dispatch(updateBusiness({ [field]: value }));
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!company.companyName?.trim())
      newErrors.companyName = "Company name is required";
    if (!business.businessType)
      newErrors.businessType = "Please select a business type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  return (
    <div className="flex flex-col justify-center px-4 xl:px-8 min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute lg:top-12 top-56 md:px-8 px-5 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="flex flex-col justify-center px-4 xl:px-8">
        <div className="lg:pb-6 pb-3">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
            Tell us about your business
          </h1>
          <p className="text-[#545454] text-sm lg:text-base font-medium">
            Help us tailor the best experience for you
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lg:space-y-3.5 space-y-2 mb-8">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
                Company Name
              </label>
              <Input
                placeholder="company name"
                value={company.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
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
                  value={company.businessRegion || ""}
                  onChange={(e) =>
                    handleChange("businessRegion", e.target.value)
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
            <div className="relative">
              <label className="block text-sm font-medium text-[#2E2E2E] lg:mb-1 mb-0.5">
                Business Type
              </label>
              <div className="relative">
                <select
                  value={business.businessType || ""}
                  onChange={(e) => handleChange("businessType", e.target.value)}
                  className={`appearance-none w-full px-4 py-2.5 text-sm pr-10 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 ${
                    errors.businessType ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Business Type</option>
                  <option value="Retail">Retail</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
                <IoCaretDownSharp className="absolute right-4 top-1/2 transform -translate-y-1/2 size-4 text-black pointer-events-none" />
                {errors.businessType && (
                  <p className="mt-0.5 lg:text-sm text-[13px] text-red-500 font-semibold">
                    {errors.businessType}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center px-4 lg:py-5 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
          >
            <div className="flex items-center">
              Continue
              <ArrowRight className="ml-2 size-4" />
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
