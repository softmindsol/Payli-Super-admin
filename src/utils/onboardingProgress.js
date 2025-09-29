export const calculateOnboardingProgress = (onboardingState) => {
  const { user, company, business, subscription, payment, currentStep } =
    onboardingState;

  let totalFields = 0;
  let completedFields = 0;

  // Step 1: User Information (7 fields)
  const userFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "password",
    "confirmPassword",
  ];
  const companyFields = ["companyName"];

  userFields.forEach((field) => {
    totalFields++;
    if (user[field] && user[field].trim()) completedFields++;
  });

  companyFields.forEach((field) => {
    totalFields++;
    if (company[field] && company[field].trim()) completedFields++;
  });

  // Step 2: Business Information (2 fields)
  const businessFields = ["platformType", "businessType"];
  businessFields.forEach((field) => {
    totalFields++;
    if (business[field] && business[field].trim()) completedFields++;
  });

  // Step 3: Subscription (1 field)
  totalFields++;
  if (subscription.plan && subscription.plan.trim()) completedFields++;

  // Step 4: Payment (4 fields)
  const paymentFields = ["email", "cardholderName", "postal", "paymentMethod"];
  paymentFields.forEach((field) => {
    totalFields++;
    if (payment[field] && payment[field].trim()) completedFields++;
  });

  const percentage =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return {
    percentage,
    completedFields,
    totalFields,
    currentStep,
    isComplete: percentage === 100,
  };
};

export const getStepProgress = (step, onboardingState) => {
  const { user, company, business, subscription, payment } = onboardingState;

  switch (step) {
    case 1: {
      const userFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ];
      const companyFields = ["companyName"];
      const allFields = [...userFields, ...companyFields];

      let completed = 0;
      userFields.forEach((field) => {
        if (user[field] && user[field].trim()) completed++;
      });
      companyFields.forEach((field) => {
        if (company[field] && company[field].trim()) completed++;
      });

      return Math.round((completed / allFields.length) * 100);
    }

    case 2: {
      const businessFields = ["platformType", "businessType"];
      let completed = 0;
      businessFields.forEach((field) => {
        if (business[field] && business[field].trim()) completed++;
      });
      return Math.round((completed / businessFields.length) * 100);
    }

    case 3: {
      return subscription.plan ? 100 : 0;
    }

    case 4: {
      const paymentFields = [
        "email",
        "cardholderName",
        "postal",
        "paymentMethod",
      ];
      let completed = 0;
      paymentFields.forEach((field) => {
        if (payment[field] && payment[field].trim()) completed++;
      });
      return Math.round((completed / paymentFields.length) * 100);
    }

    case 5: {
      return 100; // Success step is always 100%
    }

    default:
      return 0;
  }
};

export const getStepTitle = (step) => {
  const titles = {
    1: "Personal Information",
    2: "Business Details",
    3: "Subscription Plan",
    4: "Payment Information",
    5: "Complete!",
  };
  return titles[step] || "Unknown Step";
};

export const isStepCompleted = (step, onboardingState) => {
  return getStepProgress(step, onboardingState) === 100;
};
