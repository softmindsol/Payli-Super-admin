import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPlans() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/payment-method");
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/pos"); // Go back to the previous page
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      title: "Free Plan",
      price: "€0",
      period: "/month",
      description: "For most businesses that want to optimize web queries",
      features: [
        "List up to 50 products",
        "Access basic dashboard",
        "Email support",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "secondary",
      badgeVariant: "secondary",
      highlighted: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      title: "Enterprise Plan",
      price: "€399",
      period: "/month",
      description: "For most enterprise that want to optimize quries",
      features: [
        "Unlimited products",
        "Dedicated account manager",
        "API integrations",
        "Custom domain & branding",
        "24/7 support",
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default",
      badgeVariant: "default",
      highlighted: true,
    },
    {
      id: "business",
      name: "Business",
      title: "Business Plan",
      price: "€260",
      period: "/month",
      description: "For most businesses that want to optimize web queries",
      features: [
        "List up to 500 products",
        "Advanced Analysis",
        "Priority Support",
        "Mobile app success",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "secondary",
      badgeVariant: "secondary",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen space-y-10 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={handleBack}
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
              className={`relative transition-all lg:h-[550px] md:h-[450px] h-auto duration-300 ${
                plan.highlighted
                  ? "border-2 border-[#1D50AB] rounded-[14px] shadow-lg scale-105"
                  : "border border-[#E2E2E2] hover:border-gray-300 rounded-[14px]"
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant={plan.badgeVariant}
                  className={`px-10 py-1 text-sm font-medium ${
                    plan.highlighted
                      ? "bg-[#1D50AB] text-white"
                      : "bg-[#2E2E2E] text-white"
                  }`}
                >
                  {plan.name}
                </Badge>
              </div>

              <div className="flex h-full flex-col !justify-between ">
                <div className="flex flex-col">
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
                <CardFooter className="px-6 pb-6">
                  <Button
                    onClick={handleSubmit}
                    variant={plan.buttonVariant}
                    className={`w-full py-3 font-medium transition-colors ${
                      plan.highlighted
                        ? "bg-[#1D50AB] hover:bg-blue-700 text-white"
                        : "bg-[#2E2E2E] rounded-full hover:bg-gray-900 text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
