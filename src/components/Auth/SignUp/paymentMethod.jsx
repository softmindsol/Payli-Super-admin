import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoCreditCard } from "react-icons/go";
import { Bancontact, CreditCardImg, IDEAL } from "@/assets/svgs";

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    cardholderName: "",
    postal: "",
    paymentMethod: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };
  const handleBack = () => {
    navigate("/subscription-plans"); // Go back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } 
     finally {
      setIsLoading(false);
    }

    navigate("/payment-successful");
  };

  return (
    <div className="min-h-screen space-y-14 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={handleBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute top-10 md:px-8 px-5 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8">
          {/* Left Side - Plan Summary */}
          <div className="bg-white border border-[#EFEFEF] rounded-[6px] lg:px-6 px-4 py-3 lg:py-4 h-fit">
            <div className="mb-3.5">
              <h3 className="text-sm font-medium text-[#545454] mb-1">
                Plan Summary
              </h3>
              <h2 className="lg:text-2xl text-xl font-bold text-[#2E2E2E]">
                Basic Plan
              </h2>
            </div>

            <div className="">
              <div className="flex justify-between items-center py-3">
                <span className="text-[#2E2E2E] text-sm font-medium">
                  Monthly Plan
                </span>
                <span className="text-[#2E2E2E] text-sm font-medium">
                  €0/month
                </span>
              </div>

              <hr className="border-[#EFEFEF] my-3" />

              <div className="flex justify-between items-center py-3">
                <span className="text-[#2E2E2E] text-sm font-medium">
                  Sub-total
                </span>
                <span className="text-[#2E2E2E] text-sm font-medium">
                  €0.00
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Method */}
          <div className="bg-white rounded-lg px-6 md:px-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-1">
                Payment Method
              </h2>
              <p className="text-[#545454] lg:text-base text-sm font-medium">
                Help us tailor the best experience for you
              </p>
            </div>

            <div className="space-y-6">
              <div className="shadow-xl border border-[#0000001] rounded-[22px] px-7 py-9">
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-6">
                  Add Payment
                </h3>

                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-[#EFEFEF] rounded-[6px] bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="example@gmail.com"
                    />
                  </div>

                  {/* Cardholder Name Field */}
                  <div>
                    <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                      Cardholder Name
                    </label>
                    <Input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full border border-[#EFEFEF] rounded-[6px] bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="enter name"
                    />
                  </div>

                  {/* Postal Code Field */}
                  <div>
                    <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                      Postal
                    </label>
                    <Input
                      type="text"
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      className="w-full border border-[#EFEFEF] rounded-[6px] bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="0000"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Card Option */}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => handlePaymentMethodChange("card")}
                        className={`flex items-center justify-center px-4 py-6 border-2 rounded-lg ${
                          formData.paymentMethod === "card"
                            ? "border-[#1D50AB]"
                            : "border-[#EFEFEF]"
                        }`}
                      >
                        <img
                          className="size-6"
                          src={CreditCardImg}
                          alt="card"
                        />
                        <span className="font-medium text-sm text-[#292929]">
                          Card
                        </span>
                      </Button>

                      {/* iDEAL Option */}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => handlePaymentMethodChange("ideal")}
                        className={`flex items-center justify-center px-4 py-6 border-2 rounded-lg ${
                          formData.paymentMethod === "ideal"
                            ? "border-[#1D50AB]"
                            : "border-[#EFEFEF]"
                        }`}
                      >
                        <img className="size-6" src={IDEAL} alt="iDEAL" />
                        <span className="font-medium text-sm text-[#292929]">
                          iDEAL
                        </span>
                      </Button>

                      {/* Bancontact Option */}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => handlePaymentMethodChange("bancontact")}
                        className={`flex items-center justify-center px-4 py-6 border-2 rounded-lg ${
                          formData.paymentMethod === "bancontact"
                            ? "border-[#1D50AB]"
                            : "border-[#EFEFEF]"
                        }`}
                      >
                        <img
                          className="size-6"
                          src={Bancontact}
                          alt="bancontact"
                        />
                        <span className="font-medium text-sm text-[#292929]">
                          Bancontact
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="border border-[#EFEFEF] px-3 py-3.5 rounded-lg flex items-center space-x-3 mt-5">
                    <GoCreditCard className="w-5 h-5 text-[#545454]" />
                    <p className="text-[13px] font-medium text-[#545454] max-w-xs leading-tight">
                      After submission, you will be redirected to complete next
                      steps securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-primary text-black font-semibold py-4 px-6 rounded-full text-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 mr-1 border-b-2 border-black"></div>
                    <span className="text-black">Processing...</span>
                  </>
                ) : (
                  <div className="flex items-center">
                    Pay Now
                    <ArrowRight className="ml-2 size-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
