import React, { useState } from "react";
import {
  useStripe,
  useElements,
  IdealBankElement,
} from "@stripe/react-stripe-js";
import { ArrowRight } from "lucide-react";
import { GoCreditCard } from "react-icons/go";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IDEAL, Bancontact } from "@/assets/svgs";
import axios from "axios";

const StripePayment = ({ user, plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    cardholderName: user?.name || "",
    postal: "",
    paymentMethod: "ideal",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!formData.postal.trim()) {
      newErrors.postal = "Postal code is required";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not properly initialized");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all the required fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/payments/intent", {
        email: formData.email,
        plan: {
          price: plan.price,
        },
        paymentMethodType: formData.paymentMethod,
        cardholderName: formData.cardholderName,
        postal: formData.postal,
      });

      const clientSecret = data.clientSecret;
      let result;

      if (formData.paymentMethod === "ideal") {
        const idealElement = elements.getElement(IdealBankElement);
        if (!idealElement) {
          throw new Error("iDEAL element not found");
        }

        result = await stripe.confirmIdealPayment(clientSecret, {
          payment_method: {
            ideal: idealElement,
            billing_details: {
              name: formData.cardholderName,
              email: formData.email,
              address: {
                postal_code: formData.postal,
              },
            },
          },
          return_url: `${window.location.origin}/payment-successful`,
        });
      } else if (formData.paymentMethod === "bancontact") {
        // Simplified Bancontact confirmation without bank element
        result = await stripe.confirmBancontactPayment(clientSecret, {
          payment_method: {
            billing_details: {
              name: formData.cardholderName,
              email: formData.email,
              address: {
                postal_code: formData.postal,
              },
            },
          },
          return_url: `${window.location.origin}/payment-successful`,
        });
      }

      if (result?.error) {
        console.error("Payment error:", result.error);
        toast.error(
          result.error.message || "Payment failed. Please try again."
        );
        onError?.(result.error);
      } else if (result?.paymentIntent) {
        toast.success("Payment initiated successfully!");
        onSuccess?.(result.paymentIntent);

        if (result.paymentIntent.status === "succeeded") {
          navigate("/payment-successful");
        }
      }
    } catch (err) {
      console.error("Payment submission error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Payment failed. Please try again.";
      toast.error(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Plan Summary - Left Column */}
      <div className="lg:w-2/5">
        <div className="bg-white border border-[#EFEFEF] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-4">
            Order Summary
          </h2>

          <div className="mb-6">
            <div className="flex justify-between items-center py-3 border-b border-[#EFEFEF]">
              <span className="text-[#545454]">Plan</span>
              <span className="font-medium">{plan?.title}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-[#EFEFEF]">
              <span className="text-[#545454]">Billing</span>
              <span className="font-medium">Monthly</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-lg font-bold">Total</span>
              <span className="text-xl font-bold text-[#1D50AB]">
                €{Number(plan.price.split("€")[1].trim()).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-bold text-[#1D50AB] mb-2 flex items-center gap-2">
              <GoCreditCard className="w-4 h-4" />
              Secure Payment
            </h3>
            <p className="text-sm text-[#545454]">
              Your payment information is encrypted and processed securely.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form - Right Column */}
      <div className="lg:w-3/5">
        <div className="bg-white rounded-xl border border-[#EFEFEF] p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
              Payment Details
            </h2>
            <p className="text-[#545454]">Complete your purchase securely</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`w-full ${
                    errors.cardholderName ? "border-red-500" : ""
                  }`}
                  placeholder="Enter name"
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardholderName}
                  </p>
                )}
              </div>

              {/* Postal Code Field */}
              <div>
                <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                  Postal Code
                </label>
                <Input
                  type="text"
                  name="postal"
                  value={formData.postal}
                  onChange={handleInputChange}
                  className={`w-full ${errors.postal ? "border-red-500" : ""}`}
                  placeholder="0000"
                />
                {errors.postal && (
                  <p className="text-red-500 text-sm mt-1">{errors.postal}</p>
                )}
              </div>
            </div>
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-bold text-[#2E2E2E] mb-3">
                Payment Method
              </label>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handlePaymentMethodChange("ideal")}
                  className={`flex-1 min-w-[140px] py-5 ${
                    formData.paymentMethod === "ideal"
                      ? "border-2 border-[#1D50AB] bg-blue-50"
                      : ""
                  }`}
                >
                  <img className="size-6" src={IDEAL} alt="iDEAL" />
                  <span className="font-medium text-sm">iDEAL</span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handlePaymentMethodChange("bancontact")}
                  className={`flex-1 min-w-[140px] py-5 ${
                    formData.paymentMethod === "bancontact"
                      ? "border-2 border-[#1D50AB] bg-blue-50"
                      : ""
                  }`}
                >
                  <img className="size-6" src={Bancontact} alt="bancontact" />
                  <span className="font-medium text-sm">Bancontact</span>
                </Button>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
            {/* iDEAL Bank Selection */}
            {formData.paymentMethod === "ideal" && (
              <div>
                <label className="block text-sm font-bold text-[#2E2E2E] mb-2">
                  Select your bank
                </label>
                <div className="border border-[#EFEFEF] rounded-lg">
                  <IdealBankElement
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                          borderRadius: "8px",
                          padding: "12px",
                        },
                        invalid: {
                          color: "#e53e3e",
                        },
                      },
                      classes: {
                        base: "stripe-ideal-bank-element",
                        complete: "stripe-ideal-bank-element--complete",
                        empty: "stripe-ideal-bank-element--empty",
                        focus: "stripe-ideal-bank-element--focus",
                        invalid: "stripe-ideal-bank-element--invalid",
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {/* Bancontact Notice */}
            {formData.paymentMethod === "bancontact" && (
              <div className="border border-[#EFEFEF] px-4 py-3 rounded-lg bg-blue-50">
                <p className="text-sm text-[#545454]">
                  You'll be redirected to your banking app to complete the
                  Bancontact payment. No additional details required.
                </p>
              </div>
            )}
            {/* Security Notice */}
            <div className="border border-[#EFEFEF] px-4 py-3 rounded-lg flex items-start gap-3">
              <GoCreditCard className="w-5 h-5 text-[#545454] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#545454]">
                After submission, you will be redirected to complete the payment
                securely. Your payment details are never stored on our servers.
              </p>
            </div>
            {/* Pay Button */}
            <Button
              type="submit"
              disabled={!stripe || loading}
              className="w-full border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 mr-3 border-b-2 border-white"></div>
                  Processing Payment...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Pay €{Number(plan.price.split("€")[1].trim()).toFixed(2)}
                  <ArrowRight className="ml-3 size-5" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;
