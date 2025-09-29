export class DomainHandler {
  constructor() {
    this.domain = window.location.hostname;
    this.port = window.location.port ? `:${window.location.port}` : "";
    this.protocol = window.location.protocol;
    this.pathname = window.location.pathname;
    this.search = window.location.search;

    // Environment-based domain configuration
    this.config = {
      development: {
        baseDomain: import.meta.env.VITE_PLATFORM_DOMAIN_LOCAL || "localhost",
        mainApp: import.meta.env.VITE_PLATFORM_DOMAIN_LOCAL || "localhost",
      },
      production: {
        baseDomainBE: import.meta.env.VITE_PLATFORM_DOMAIN_BE || "app.payli.be",
        baseDomainNL: import.meta.env.VITE_PLATFORM_DOMAIN_NL || "app.payli.nl",
      }
    };
  }

  getBaseDomain(tld = "be") {
    const isDevelopment = import.meta.env.VITE_ENV === "development";

    if (isDevelopment) {
      return this.config.development.baseDomain;
    }

    return tld === "nl" ?
      this.config.production.baseDomainNL :
      this.config.production.baseDomainBE;
  }

  getMainDomain(tld = "be") {
    const isDevelopment = import.meta.env.VITE_ENV === "development";

    if (isDevelopment) {
      return `${this.config.development.mainApp}${this.port}`;
    }

    return tld === "nl" ?
      this.config.production.baseDomainNL :
      this.config.production.baseDomainBE;
  }

  getTenantDomain(tenantId, tld = "be") {
    const isDevelopment = import.meta.env.VITE_ENV === "development";

    if (isDevelopment) {
      return tenantId === "app" ?
        `${this.config.development.baseDomain}${this.port}` :
        `${tenantId}.${this.config.development.baseDomain}${this.port}`;
    }

    const baseDomain = this.getBaseDomain(tld);
    return tenantId === "app" ?
      this.getMainDomain(tld) :
      `${tenantId}.${baseDomain}`;
  }

  detectLanguageFromDomain() {
    const domain = this.domain;

    if (domain.endsWith(".be") || domain.includes(".be:")) {
      return "nl";
    }

    if (domain.endsWith(".nl") || domain.includes(".nl:")) {
      return "en";
    }

    const urlParams = new URLSearchParams(this.search);
    const langParam = urlParams.get("lang");
    if (langParam && ["en", "nl"].includes(langParam)) {
      return langParam;
    }

    return "en";
  }

  extractTenantInfo() {
    const domain = this.domain;
    const isDevelopment = import.meta.env.VITE_ENV === "development";
    const baseDomainLocal = import.meta.env.VITE_PLATFORM_DOMAIN_LOCAL || "localhost";

    // Handle localhost development environments
    const isBasicLocalhost = domain === baseDomainLocal || domain === "127.0.0.1";
    const isLocalhostSubdomain = domain.endsWith(`.${baseDomainLocal}`) || domain.endsWith(".127.0.0.1");
    const isAnyLocalhost = isBasicLocalhost || isLocalhostSubdomain;

    if (isAnyLocalhost && isDevelopment) {
      const subdomain = this.extractSubdomain();
      return {
        tenantId: subdomain || "app",
        domain: domain,
        isCustomDomain: false,
        isSubdomain: !!subdomain,
        fullDomain: subdomain
          ? `${subdomain}.${domain}${this.port}`
          : `${domain}${this.port}`,
        tld: null,
      };
    }

    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];

    // Get production domains from environment
    const baseDomainBE = (import.meta.env.VITE_PLATFORM_DOMAIN_BE || "app.payli.be");
    const baseDomainNL = (import.meta.env.VITE_PLATFORM_DOMAIN_NL || "app.payli.nl");
    const mainDomainBE = import.meta.env.VITE_PLATFORM_DOMAIN_BE || "app.payli.be";
    const mainDomainNL = import.meta.env.VITE_PLATFORM_DOMAIN_NL || "app.payli.nl";

    const isPayliDomain = domain.endsWith(baseDomainBE) || domain.endsWith(baseDomainNL);
    const isMainDomain = domain === mainDomainBE || domain === mainDomainNL;

    // Handle custom domains (non-Payli domains and non-localhost)
    if (!isPayliDomain && !isAnyLocalhost && !isMainDomain) {
      return {
        tenantId: null,
        domain: domain,
        isCustomDomain: true,
        isSubdomain: false,
        fullDomain: domain,
        tld: tld,
      };
    }

    // Handle main domains (app.payli.be or app.payli.nl)
    if (isMainDomain) {
      return {
        tenantId: "app",
        domain: domain,
        isCustomDomain: false,
        isSubdomain: false,
        fullDomain: domain,
        tld: tld,
        isMainDomain: true,
      };
    }

    // Handle tenant subdomains (tenant.payli.tld)
    if (isPayliDomain && !isMainDomain) {
      const subdomain = domainParts[0];
      return {
        tenantId: subdomain,
        domain: domain,
        isCustomDomain: false,
        isSubdomain: true,
        fullDomain: domain,
        tld: tld,
        isMainDomain: false,
      };
    }

    // Fallback to app domain
    return {
      tenantId: "app",
      domain: domain,
      isCustomDomain: false,
      isSubdomain: false,
      fullDomain: this.getMainDomain(tld),
      tld: tld,
      isMainDomain: true,
    };
  }

  extractSubdomain() {
    const urlParams = new URLSearchParams(this.search);
    const subdomainParam = urlParams.get("subdomain");

    if (subdomainParam) {
      return subdomainParam;
    }

    const baseDomainLocal = import.meta.env.VITE_PLATFORM_DOMAIN_LOCAL || "localhost";

    // Handle subdomain.localhost or subdomain.127.0.0.1 patterns
    if (this.domain.endsWith(`.${baseDomainLocal}`) || this.domain.endsWith(".127.0.0.1")) {
      return this.domain.split(".")[0];
    }

    // Handle regular localhost with subdomain in URL params
    if (this.domain === baseDomainLocal || this.domain === "127.0.0.1") {
      return subdomainParam || null;
    }

    // For any other domain with dots, extract the first part as subdomain
    if (this.domain.includes(".")) {
      return this.domain.split(".")[0];
    }

    return null;
  }

  redirectToTenantDomain(tenantId, isCustomDomain = false, targetPath = null) {
    const currentInfo = this.extractTenantInfo();

    // Handle custom domain redirects
    if (isCustomDomain) {
      if (currentInfo.isCustomDomain && currentInfo.domain === tenantId) {
        return false;
      }

      const finalPath = targetPath || this.pathname;
      const finalSearch = targetPath ? '' : this.search; // Clear search params if using custom target path
      const targetUrl = `${this.protocol}//${tenantId}.${this.getMainDomain(currentInfo.tld)}${finalPath}${finalSearch}`;
      window.location.href = targetUrl;
      return true;
    }

    // Skip redirect if already on correct domain
    if (currentInfo.tenantId === tenantId && !currentInfo.isMainDomain) {
      return false;
    }

    // Use target path if provided, otherwise use current path
    const finalPath = targetPath || this.pathname;
    const finalSearch = targetPath ? '' : this.search; // Clear search params if using custom target path

    // Simple redirect - cookies will handle authentication automatically
    const targetUrl = `${this.protocol}//${tenantId}.${this.getMainDomain(currentInfo.tld)}${finalPath}${finalSearch}`;
    window.location.href = targetUrl;
    return true;
  }

  validateTenantDomain(expectedTenantId, isCustomDomain = false) {
    const currentInfo = this.extractTenantInfo();

    if (isCustomDomain) {
      return currentInfo.isCustomDomain;
    }

    return currentInfo.tenantId === expectedTenantId;
  }

  getTenantApiBaseUrl() {
    const tenantInfo = this.extractTenantInfo();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    if (tenantInfo.isCustomDomain) {
      return `${baseUrl}?domain=${encodeURIComponent(tenantInfo.domain)}`;
    }

    if (tenantInfo.tenantId && tenantInfo.tenantId !== "app") {
      return `${baseUrl}?tenant=${tenantInfo.tenantId}`;
    }

    return baseUrl;
  }

  generateTenantUrl(path = "", tenantId = null) {
    const currentInfo = this.extractTenantInfo();
    const targetTenant = tenantId || currentInfo.tenantId || "app";
    const targetTld = currentInfo.tld || "be";

    // Use the new domain configuration methods
    const domain = this.getTenantDomain(targetTenant, targetTld);

    return `${this.protocol}//${domain}${path}`;
  }

  needsRedirection(expectedTenantId) {
    const currentInfo = this.extractTenantInfo();
    return (
      !this.validateTenantDomain(expectedTenantId) &&
      !currentInfo.isCustomDomain
    );
  }

  validateCrossDomainAccess(userTenantData, targetDomain = null) {
    const currentInfo = this.extractTenantInfo();
    const target = targetDomain || currentInfo;

    if (currentInfo.domain === target.domain) {
      return { allowed: true, reason: "same_domain" };
    }

    // STRICT RULE: Users from tenant subdomains cannot access main domain private routes
    if (target.isMainDomain && userTenantData && userTenantData.tenantId && userTenantData.tenantId !== "app") {
      return {
        allowed: false,
        reason: "tenant_cannot_access_main_domain",
        message: `Tenant users cannot access main domain. Please use your tenant domain: ${userTenantData.tenantSubdomain || userTenantData.tenantId}.${target.domain}`
      };
    }

    // STRICT RULE: Users authenticated on main domain cannot access tenant subdomains
    if (target.isSubdomain && target.tenantId !== "app" && userTenantData && userTenantData.tenantId === "app") {
      return {
        allowed: false,
        reason: "main_domain_user_cannot_access_tenant",
        message: "Main domain users cannot access tenant subdomains"
      };
    }

    if (currentInfo.tld !== target.tld && currentInfo.tld && target.tld) {
      return {
        allowed: false,
        reason: "cross_tld_access_blocked",
        message: "Cross-domain access between .be and .nl is restricted"
      };
    }

    // For tenant domains, use strict subdomain-based validation
    if (userTenantData && target.tenantId && target.tenantId !== "app") {
      // Check if user has tenant subdomain in their data
      if (userTenantData.tenantSubdomain) {
        if (userTenantData.tenantSubdomain !== target.tenantId) {
          return {
            allowed: false,
            reason: "tenant_subdomain_mismatch",
            message: `User authorized for '${userTenantData.tenantSubdomain}' but accessing '${target.tenantId}'`
          };
        }
      }
      // STRICT RULE: If user doesn't have specific tenant subdomain data but has tenantId, 
      // only allow access if tenantId matches the accessing subdomain
      else if (userTenantData.tenantId !== target.tenantId) {
        return {
          allowed: false,
          reason: "tenant_id_mismatch",
          message: `User tenant '${userTenantData.tenantId}' cannot access subdomain '${target.tenantId}'`
        };
      }
    }

    return { allowed: true, reason: "authorized" };
  }

  // New utility method to check if current user can access private routes on current domain
  canAccessPrivateRoutes(userTenantData) {
    const currentInfo = this.extractTenantInfo();

    // For public routes, always allow access
    if (!userTenantData) {
      return { allowed: true, reason: "public_access" };
    }

    // Apply strict domain validation for private routes
    return this.validateCrossDomainAccess(userTenantData, currentInfo);
  }

  // Helper method to get the correct redirect URL for a tenant user
  getTenantRedirectUrl(userTenantData, currentPath = "/", currentSearch = "") {
    const currentInfo = this.extractTenantInfo();

    if (!userTenantData || !userTenantData.tenantSubdomain) {
      return null;
    }

    const tenantDomain = this.getTenantDomain(userTenantData.tenantSubdomain, currentInfo.tld || "be");
    return `${window.location.protocol}//${tenantDomain}${currentPath}${currentSearch}`;
  }



  clearDomainAuthData() {
    const currentInfo = this.extractTenantInfo();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${currentInfo.domain}`;

      if (currentInfo.isSubdomain) {
        const parentDomain = currentInfo.domain.substring(currentInfo.domain.indexOf('.'));
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
      }
    });

    console.log("Cleared auth data for domain:", currentInfo.domain);
  }
}

// Singleton instance
export const domainHandler = new DomainHandler();

// Utility functions
export const extractTenantFromDomain = () => domainHandler.extractTenantInfo();
export const redirectToTenant = (tenantId, isCustomDomain = false, targetPath = null) =>
  domainHandler.redirectToTenantDomain(tenantId, isCustomDomain, targetPath);
export const validateDomain = (expectedTenantId, isCustomDomain = false) =>
  domainHandler.validateTenantDomain(expectedTenantId, isCustomDomain);
export const getTenantApiUrl = () => domainHandler.getTenantApiBaseUrl();
export const generateTenantUrl = (path, tenantId) =>
  domainHandler.generateTenantUrl(path, tenantId);
export const detectLanguageFromDomain = () => domainHandler.detectLanguageFromDomain();
export const validateCrossDomainAccess = (userTenantData, targetDomain) =>
  domainHandler.validateCrossDomainAccess(userTenantData, targetDomain);
export const clearDomainAuthData = () => domainHandler.clearDomainAuthData();
export const needsRedirection = (expectedTenantId) =>
  domainHandler.needsRedirection(expectedTenantId);
export const canAccessPrivateRoutes = (userTenantData) =>
  domainHandler.canAccessPrivateRoutes(userTenantData);
export const getTenantRedirectUrl = (userTenantData, currentPath, currentSearch) =>
  domainHandler.getTenantRedirectUrl(userTenantData, currentPath, currentSearch);