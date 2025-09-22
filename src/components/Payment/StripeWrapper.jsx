import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "./StripePayment";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeWrapper = ({ user, plan, onSuccess, onError, ...props }) => {
  const options = {
    // passing the client_secret from the backend
    mode: "payment",
    currency: "eur",
    amount: Number(plan.price.split("€")[1].trim()), // Ensure amount is a number
    // Customize the appearance of Elements using the Appearance API.
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#1D50AB",
        colorBackground: "#ffffff",
        colorText: "#2E2E2E",
        colorDanger: "#df1b41",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePayment
        user={user}
        plan={plan}
        onSuccess={onSuccess}
        onError={onError}
        {...props}
      />
    </Elements>
  );
};

export default StripeWrapper;
