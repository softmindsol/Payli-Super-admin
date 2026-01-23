import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { updateSubscription } from "../../store/features/onboarding/onboarding.slice";

const SubscriptionStep = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.onboarding);
  const [selectedPlan, setSelectedPlan] = useState(subscription.plan.id || "");

  const plans = [
    {
      id: "webshop",
      name: "Webshop",
      title: "Webshop Plan",
      price: "€49",
      period: "/month",
      description:
        "Get your shop online quickly with our easy-to-use setup tools.",
      features: [
        "A complete webshop",
        "Easy web builder",
        "Up to 500 products",
        "Integrated payment system",
        "Inventory management",
        "User management",
        "Add up to 5 staff members",
        "Email support",
      ],
      buttonText: "Start Webshop",
      buttonVariant: "default",
      badgeVariant: "default",
      highlighted: false,
    },
    {
      id: "pos",
      name: "POS",
      title: "POS Plan",
      price: "€49",
      period: "/month",
      description:
        "Live sales tracking with real-time analytics on your physical devices.",
      features: [
        "2 POS apps included",
        "Mobile scanner",
        "Integrated payment system",
        "Location management",
        "Inventory management",
        "Advanced reports",
        "User management",
        "2 Locations",
        "Email and phone support",
      ],
      buttonText: "Start POS",
      buttonVariant: "default",
      badgeVariant: "default",
      highlighted: false,
    },
    {
      id: "combo",
      name: "Combo",
      title: "Combo Plan",
      price: "€79",
      period: "/month",
      description:
        "Manage in-store and online sales from a single dashboard for ultimate efficiency.",
      features: [
        "All benefits of POS and Webshop plans",
        "A complete webshop",
        "Easy web builder",
        "2 POS apps included",
        "Integrated payment system",
        "Inventory management",
        "Advanced reports",
        "Location management",
        "User management",
        "2 Locations",
        "Add up to 5 staff members",
        "Email and phone support",
      ],
      buttonText: "Start Combo Plan",
      buttonVariant: "default",
      badgeVariant: "default",
      highlighted: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);
    dispatch(updateSubscription({ plan }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      alert("Please select a subscription plan");
      return;
    }

    onNext();
  };

  return (
    <div className="min-h-screen space-y-10 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute top-10 md:px-8 px-5 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-[#2E2E2E] mb-1">
            Subscription Plans
          </h1>
          <p className="lg:text-lg text-base font-medium !leading-snug text-[#545454] max-w-2xl mx-auto">
            Choose a plan that fits your needs. All plans include secure
            transactions and verified user protection.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all  flex flex-col duration-300 cursor-pointer ${
                plan.highlighted
                  ? "border-2 border-[#1D50AB] rounded-[14px] shadow-lg scale-105"
                  : selectedPlan === plan.id
                  ? "border-2 border-[#1D50AB] rounded-[14px] shadow-lg"
                  : "border border-[#E2E2E2] hover:border-gray-300 rounded-[14px]"
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant={plan.badgeVariant}
                  className={`px-10 py-1 text-sm font-medium ${
                    plan.highlighted || selectedPlan === plan.id
                      ? "bg-[#1D50AB] text-white"
                      : "bg-[#2E2E2E] text-white"
                  }`}
                >
                  {plan.name}
                </Badge>
              </div>

              {/* Selection indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <IoCheckmarkDoneSharp className="h-6 w-6 text-[#1D50AB]" />
                </div>
              )}

              <div className="flex flex-col flex-1 justify-between h-full">
                <div>
                  <CardHeader className="text-center pt-8 pb-4">
                    <h3 className="lg:text-[26px] text-xl font-bold text-[#2E2E2E] mb-0.5">
                      {plan.title}
                    </h3>
                    <p className="text-sm font-medium text-[#545454] mb-4 px-7 !leading-snug">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="lg:text-[38px] md:text-3xl text-2xl my-3 font-bold text-[#292929]">
                        {plan.price}
                      </span>
                      <span className="text-[#545454] text-sm font-semibold">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <IoCheckmarkDoneSharp className="h-5 w-5 text-[#1D50AB] mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-[#545454] font-medium text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                {/* <CardFooter className="px-6 pb-6 mt-auto">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan.id);
                    }}
                    variant={plan.buttonVariant}
                    className={`w-full py-3 font-medium transition-colors ${
                      plan.highlighted || selectedPlan === plan.id
                        ? "bg-[#1D50AB] hover:bg-blue-700 text-white"
                        : "bg-[#2E2E2E] rounded-full hover:bg-gray-900 text-white"
                    }`}
                  >
                    {selectedPlan === plan.id ? "Selected" : plan.buttonText}
                  </Button>
                </CardFooter> */}
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={handleSubmit}
            disabled={!selectedPlan}
            className="px-12 py-3 text-lg font-medium bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStep;
