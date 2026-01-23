import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    // If authenticated, redirect to clients
    return <Navigate to="/clients" replace />;
  }

  return children;
};

export default PublicRoute;
