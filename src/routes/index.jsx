import { useRoutes } from "react-router-dom";
import PATHS, { PUBLIC_ROUTES } from "./path";
import AppLayout from "../layout/AppLayout"; // Your AppLayout component
import ClientsList from "../pages/SuperAdminDashboard/Clients"; // Your ClientsList component
import Dashboard from "../pages/SuperAdminDashboard/Dashboard";
import DefaultLayout from "../layout/DefaultLayout"; // Auth/Public
import Login from "../pages/Auth/Login/index"
import InventoryManagement from "@/pages/SuperAdminDashboard/Inventory";

const routes = [
   // ---------- AUTH / PUBLIC ----------
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: PUBLIC_ROUTES.login,
        element: (
            <Login />
        ),
      },
     
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: PATHS.clients, 
        element: <ClientsList /> 
      },
        { path: PATHS.dashboard, 
        element: <Dashboard /> 
      },
      { path: PATHS.inventory, 
        element: <InventoryManagement /> 
      },
    ],
  },
];

const Routes = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default Routes;
