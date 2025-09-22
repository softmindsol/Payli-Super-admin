import { Rocket } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetOnboarding } from "../../store/features/onboarding/onboarding.slice";

const SuccessStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleComplete = () => {
    dispatch(resetOnboarding());
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 text-center">
      <img src={Rocket} alt="" className="lg:mb-11 mb-7" />
      <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl text-[#2E2E2E] leading-tight font-bold mb-1">
        Payment Has Been Paid Successfully!{" "}
      </h1>
      <p className="lg:text-lg sm:text-base text-sm font-medium text-[#545454] leading-6 lg:mb-8 mb-4">
        Thank you! We&apos;ve received your payment and it has been <br />
        processed successfully. Your account is now ready to use.{" "}
      </p>

      <Button
        onClick={handleComplete}
        type="submit"
        className="max-w-lg flex items-center justify-center px-4 py-6 border border-transparent rounded-full shadow-sm text-base font-semibold text-black bg-gradient-primary hover:bg-gradient-to-r from-[#C9DDF9] to-[#B2F0E7] transition-all"
      >
        <div className="flex items-center">
          Go to Dashboard
          <ArrowRight className="ml-2 mt-0.5 size-4" />
        </div>
      </Button>
    </div>
  );
};

export default SuccessStep;
