import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../../store/features/onboarding/onboarding.slice";
import StripeWrapper from "../Payment/StripeWrapper";
import { toast } from "sonner";

const PaymentStep = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const { subscription, user } = useSelector((state) => state.onboarding);

  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    dispatch(
      updatePayment({
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
      })
    );
    toast.success("Payment completed successfully!");
    onNext();
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    toast.error("Payment failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <button
        onClick={onBack}
        className="flex items-center text-[#2E2E2E] hover:opacity-70 absolute top-10 left-10 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-base font-medium">Back</span>
      </button>

      <div className="w-full max-w-4xl mx-auto">
        <StripeWrapper
          user={{
            email: user?.email,
            name: `${user?.firstName} ${user?.lastName}`,
          }}
          plan={subscription?.plan}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
