import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieUtils";
import { isJWTExpired } from "../utils/tokenUtils";

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
      if (token && !isJWTExpired(token)) {
        // Token exists and is not expired
        setIsAuthenticated(true);
        // Set user data if available
      } else {
        // Token is expired or doesn't exist
        setIsAuthenticated(false);
        if (token && isJWTExpired(token)) {
          // Clear expired token
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Check token expiration every minute
    const interval = setInterval(() => {
      const token = getCookie("accessToken");
      if (token && isJWTExpired(token)) {
        console.log("Token expired, logging out");
        logout();
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
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
