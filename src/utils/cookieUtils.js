import Cookies from "js-cookie";

export const setCookie = (name, value, days = 365) => {
  Cookies.set(name, value, {
    expires: days,
    path: "/",
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
  });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const deleteCookie = (name) => {
  Cookies.remove(name, { path: "/" });
};

export const getLanguageFromCookie = () => {
  return Cookies.get("i18nextLng");
};

export const setLanguageInCookie = (language) => {
  Cookies.set("i18nextLng", language, {
    expires: 365,
    path: "/",
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
  });
};

/**
 * Check if user is authenticated by checking for auth cookies
 */
export const hasAuthCookies = () => {
  return getCookie('accessToken');
};

/**
 * Get current user domain (.payli.be or .payli.nl)
 */
export const getCurrentRootDomain = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('payli.be')) {
    return '.app.payli.be';
  } else if (hostname.includes('payli.nl')) {
    return '.app.payli.nl';
  }
  return hostname;
};

/**
 * Set domain-aware cookie for cross-domain authentication
 */
export const setDomainCookie = (name, value, options = {}) => {
  const domain = getCurrentRootDomain();
  Cookies.set(name, value, {
    expires: 7, // 7 days
    path: "/",
    domain: domain,
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
    ...options
  });
};
