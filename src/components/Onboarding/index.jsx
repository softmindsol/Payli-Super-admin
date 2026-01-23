import { useSelector, useDispatch } from "react-redux";
import { setCurrentStep } from "../../store/features/onboarding/onboarding.slice";
import {
  useOnboardingPersistence,
  useOnboardingUnloadWarning,
} from "../../hooks/useOnboardingPersistence";
import UserInfoStep from "./UserInfoStep";
import BusinessInfoStep from "./BusinessInfoStep";
import SubscriptionStep from "./SubscriptionStep";
import PaymentStep from "./PaymentStep";
import SuccessStep from "./SuccessStep";
import LeftPanel from "../Auth/LoginPage/leftPanel";

const Onboarding = () => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((state) => state.onboarding);

  // Use persistence hooks
  useOnboardingPersistence();
  useOnboardingUnloadWarning();

  const handleNext = () => {
    dispatch(setCurrentStep(currentStep + 1));
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserInfoStep onNext={handleNext} />;
      case 2:
        return <BusinessInfoStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SubscriptionStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <PaymentStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <SuccessStep />;
      default:
        return <UserInfoStep onNext={handleNext} />;
    }
  };

  return (
    <section className="container mx-auto">
      {currentStep === 1 || currentStep === 2 ? (
        <div className="flex lg:justify-start justify-start md:gap-12 lg:gap-3 xl:gap-0 w-full min-h-screen pt-10 sm:pt-0 pb-4 sm:pb-0">
          <div className="hidden lg:block w-full xl:max-w-[544px] lg:max-w-[400px]">
            <LeftPanel />
          </div>
          <div className="flex-1">{renderStep()}</div>
        </div>
      ) : (
        <div className="flex-1">{renderStep()}</div>
      )}
    </section>
  );
};

export default Onboarding;
