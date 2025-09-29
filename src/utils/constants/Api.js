import axios from "axios";
import config from "./baseURL";
import { extractTenantFromDomain } from "../domainHandler";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

// ---- Request Interceptor ----
api.interceptors.request.use((config) => {
  config.withCredentials = true;

  try {
    const tenantInfo = extractTenantFromDomain();

    if (tenantInfo.isCustomDomain) {
      config.headers["X-Tenant-Domain"] = tenantInfo.domain;
    } else if (tenantInfo.tenantId && tenantInfo.tenantId !== "app") {
      config.headers["X-Tenant-ID"] = tenantInfo.tenantId;
    }

    config.headers["X-Current-Domain"] = tenantInfo.domain;
  } catch (err) {
    console.warn("Failed to add tenant context:", err);
  }

  return config;
});

// ---- Response Interceptor ----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Only handle 401/403 for non-auth endpoints
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // Skip refresh for login/register endpoints as they should fail normally
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/forgot-password") ||
        originalRequest.url.includes("/auth/verify-otp") ||
        originalRequest.url.includes("/auth/reset-password")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      try {
        isRefreshing = true;
        console.log("Access token expired → attempting refresh");

        await refreshApi.post("/auth/refresh-token");

        processQueue(null);
        isRefreshing = false;

        console.log("Token refreshed successfully, retrying original request");
        return api(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh failed → clearing auth state");

        processQueue(refreshError, null);
        isRefreshing = false;

        // Only clear auth state, don't redirect here
        // Let the AuthProvider handle the redirect logic
        handleLogoutCleanup();
        return Promise.reject(refreshError);
      }
    }

    if (status >= 500) {
      console.error("Server error:", status, error.response.data);
    }

    return Promise.reject(error);
  }
);

// ---- Centralized logout cleanup ----
function handleLogoutCleanup() {
  try {
    import("../../store").then(({ store }) => {
      import("../../store/features/auth/auth.slice").then(({ clearAuth }) => {
        store.dispatch(clearAuth());
      });
    });

    // Clean any potential residual storage items
    const authKeys = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("auth_") ||
        key.startsWith("user_") ||
        key.includes("token") ||
        key === "accessToken" ||
        key === "refreshToken" ||
        key === "user_id"
    );
    authKeys.forEach((key) => localStorage.removeItem(key));

    // Don't redirect immediately - let AuthProvider handle routing
    // The AuthProvider will detect isAuthenticated: false and handle redirect
  } catch (err) {
    console.error("Error during logout cleanup:", err);
    // Only redirect as last resort if cleanup fails
    if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  }
}

export default api;