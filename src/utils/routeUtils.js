import { PUBLIC_ROUTES, PRIVATE_ROUTES } from "@/routes/path";

export const isPublicRoute = (path) => {
  return Object.values(PUBLIC_ROUTES).includes(path);
};

export const isPrivateRoute = (path) => {
  return Object.values(PRIVATE_ROUTES).includes(path);
};

export const getDefaultAuthenticatedRoute = () => {
  return PRIVATE_ROUTES.dashboard;
};

export const getDefaultUnauthenticatedRoute = () => {
  return PUBLIC_ROUTES.login;
};

export const shouldRedirectWhenAuthenticated = (path) => {
  // Routes that should redirect authenticated users
  const authRedirectRoutes = [
    PUBLIC_ROUTES.login,
    PUBLIC_ROUTES.signUpFlow,
    PUBLIC_ROUTES.onboarding,
  ];

  return authRedirectRoutes.includes(path);
};

export const allowsAuthenticatedUsers = (path) => {
  // Routes that authenticated users can access without being redirected
  const allowedRoutes = [
    PUBLIC_ROUTES.resetPassword,
    PUBLIC_ROUTES.otp,
    PUBLIC_ROUTES.newPassword,
    PUBLIC_ROUTES.passwordResetSuccessful,
    PUBLIC_ROUTES.subscriptionPlans,
    PUBLIC_ROUTES.paymentMethod,
    PUBLIC_ROUTES.paymentStatus,
    PUBLIC_ROUTES.POS,
  ];

  return allowedRoutes.includes(path);
};
