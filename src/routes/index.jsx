import { useRoutes } from "react-router-dom";
import PATHS from "./path";
import AppLayout from "../layout/AppLayout"; // Your AppLayout component
import ClientsList from "../pages/SuperAdminDashboard/Clients"; // Your ClientsList component

const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: PATHS.clients, element: <ClientsList /> },
    ],
  },
];

const Routes = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default Routes;
