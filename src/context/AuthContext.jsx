import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieUtils";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("accessToken"); // Assuming token is stored in cookie
      if (token) {
        // You might want to validate the token here
        setIsAuthenticated(true);
        // Set user data if available
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, refreshToken, userData) => {
    setCookie("accessToken", token);
    setCookie("refreshToken", refreshToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
