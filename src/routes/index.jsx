import { useRoutes } from "react-router-dom";
import PATHS, { PUBLIC_ROUTES } from "./path";
import AppLayout from "../layout/AppLayout"; // Your AppLayout component
import ClientsList from "../pages/SuperAdminDashboard/Clients"; // Your ClientsList component
import Dashboard from "../pages/SuperAdminDashboard/Dashboard";
import DefaultLayout from "../layout/DefaultLayout"; // Auth/Public
import PublicRoute from "../components/PublicRoute";
import Login from "../pages/Auth/Login/index";
import SignUp from "../pages/Auth/SignUpFlow/index";
import ResetPassword from "../pages/Auth/ResetPassword/index";
import NewPassword from "../pages/Auth/CreateNewPassword/index";
import OTP from "../pages/Auth/OTP/index";
import PasswordResetSuccessful from "../pages/Auth/PasswordResetSuccessful/index";
import InventoryManagement from "@/pages/SuperAdminDashboard/Inventory";
import NotFound from "../pages/NotFound/index";
import ProtectedRoute from "../components/ProtectedRoute";
import CouponsManagement from "@/pages/SuperAdminDashboard/Coupons";

const routes = [
  // ---------- AUTH / PUBLIC ----------
  {
    path: "/",
    element: (
      <PublicRoute>
        <DefaultLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: PUBLIC_ROUTES.login,
        element: <Login />,
      },
      {
        path: PUBLIC_ROUTES.signup,
        element: <SignUp />,
      },
      {
        path: PUBLIC_ROUTES.resetPassword,
        element: <ResetPassword />,
      },
      {
        path: PUBLIC_ROUTES.newPassword,
        element: <NewPassword />,
      },
      {
        path: PUBLIC_ROUTES.otp,
        element: <OTP />,
      },
      {
        path: PUBLIC_ROUTES.passwordResetSuccessful,
        element: <PasswordResetSuccessful />,
      },
      {
        path: PATHS.notFound,
        element: <NotFound />,
      },
    ],
  },
  // ---------- PRIVATE / PROTECTED ----------
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: PATHS.clients, element: <ClientsList /> },
      { path: PATHS.dashboard, element: <Dashboard /> },
      { path: PATHS.inventory, element: <InventoryManagement /> },
      { path: PATHS.notFound, element: <NotFound /> },
      { path: PATHS.clients, element: <ClientsList /> },
      { path: PATHS.dashboard, element: <Dashboard /> },
      { path: PATHS.inventory, element: <InventoryManagement /> },
      { path: PATHS.coupons, element: <CouponsManagement /> },
    ],
  },
];

const Routes = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default Routes;
