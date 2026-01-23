// Optimized tenant utilities with better performance and caching
import { domainHandler } from "./domainHandler";

// Cache for domain info to avoid repeated calculations
let cachedDomainInfo = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds


export const getCachedDomainInfo = () => {
    const now = Date.now();
    if (!cachedDomainInfo || now - cacheTimestamp > CACHE_DURATION) {
        cachedDomainInfo = domainHandler.extractTenantInfo();
        cacheTimestamp = now;
    }
    return cachedDomainInfo;
};


export const clearDomainCache = () => {
    cachedDomainInfo = null;
    cacheTimestamp = 0;
};


export const shouldRedirectToTenantDomain = (user, currentDomainInfo = null) => {
    // Early returns for performance
    if (!user) return false;

    const domainInfo = currentDomainInfo || getCachedDomainInfo();

    // Quick checks with early returns
    const hasValidTenantSubdomain = user.tenantSubdomain && typeof user.tenantSubdomain === 'string';
    if (!hasValidTenantSubdomain) return false;

    const isNotAppUser = user.tenantId && user.tenantId !== "app";
    if (!isNotAppUser) return false;

    const isOnMainDomain = domainInfo.isMainDomain === true;
    if (!isOnMainDomain) return false;

    const isDifferentFromCurrentTenant = user.tenantSubdomain !== domainInfo.tenantId;
    if (!isDifferentFromCurrentTenant) return false;

    return true;
};


export const handleTenantRedirection = (user, currentDomainInfo = null, targetPath = null) => {
    const domainInfo = currentDomainInfo || getCachedDomainInfo();

    if (!shouldRedirectToTenantDomain(user, domainInfo)) {
        return false;
    }

    const targetDomain = `${user.tenantSubdomain}.app.${domainInfo.tld === 'nl' ? 'payli.nl' : 'payli.be'}`;

    console.log("🚀 Redirecting tenant user from main domain", {
        from: domainInfo.domain,
        to: targetDomain,
        userTenantSubdomain: user.tenantSubdomain,
        userTenantId: user.tenantId,
        usingCookieAuth: true,
        targetPath: targetPath
    });

    // Use the domain handler to perform the redirect
    domainHandler.redirectToTenantDomain(
        user.tenantSubdomain,
        false, // Not a custom domain
        targetPath // Pass the target path
    );

    return true;
};


export const validateTenantAccess = (user, currentDomainInfo = null) => {
    const domainInfo = currentDomainInfo || getCachedDomainInfo();

    // Allow access patterns with early returns for performance
    if (domainInfo.isMainDomain) {
        return { allowed: true, reason: "main_domain_access" };
    }

    if (domainInfo.isCustomDomain) {
        return { allowed: true, reason: "custom_domain_access" };
    }

    if (domainInfo.isSubdomain) {
        // Check if user is accessing their correct subdomain
        if (user?.tenantSubdomain === domainInfo.tenantId) {
            return { allowed: true, reason: "correct_tenant_subdomain" };
        } else {
            return {
                allowed: false,
                reason: "wrong_tenant_subdomain",
                details: {
                    userSubdomain: user?.tenantSubdomain,
                    accessingSubdomain: domainInfo.tenantId,
                    userTenantId: user?.tenantId,
                },
            };
        }
    }

    return { allowed: true, reason: "default_access" };
};


export const generateTenantUrl = (path = "", tenantId = null) => {
    const domainInfo = getCachedDomainInfo();
    const targetTenant = tenantId || domainInfo.tenantId || "app";
    const targetTld = domainInfo.tld || "be";

    const isDevelopment = import.meta.env.VITE_ENV === "development";

    let domain;
    if (isDevelopment) {
        const baseDomainLocal = import.meta.env.VITE_PLATFORM_DOMAIN_LOCAL || "localhost";
        const port = window.location.port ? `:${window.location.port}` : "";
        domain = targetTenant === "app"
            ? `${baseDomainLocal}${port}`
            : `${targetTenant}.${baseDomainLocal}${port}`;
    } else {
        const baseDomain = targetTld === "nl"
            ? (import.meta.env.VITE_PLATFORM_DOMAIN_NL || "app.payli.nl").replace("app.", "")
            : (import.meta.env.VITE_PLATFORM_DOMAIN_BE || "app.payli.be").replace("app.", "");

        domain = targetTenant === "app"
            ? (targetTld === "nl" ? import.meta.env.VITE_PLATFORM_DOMAIN_NL || "app.payli.nl" : import.meta.env.VITE_PLATFORM_DOMAIN_BE || "app.payli.be")
            : `${targetTenant}.${baseDomain}`;
    }

    return `${window.location.protocol}//${domain}${path}`;
};

/**
 * Batch domain operations for efficiency
 */
export const batchDomainOperations = {
    /**
     * Initialize multiple domain checks at once
     */
    initializeAll: () => {
        const domainInfo = getCachedDomainInfo();
        return {
            domainInfo,
            isMainDomain: domainInfo.isMainDomain,
            isSubdomain: domainInfo.isSubdomain,
            isCustomDomain: domainInfo.isCustomDomain,
            tenantId: domainInfo.tenantId,
        };
    },

    /**
     * Validate user across multiple domain contexts
     */
    validateUserForAllDomains: (user) => {
        const domainInfo = getCachedDomainInfo();
        return {
            shouldRedirect: shouldRedirectToTenantDomain(user, domainInfo),
            accessValidation: validateTenantAccess(user, domainInfo),
            tenantUrl: user?.tenantSubdomain ? generateTenantUrl("/", user.tenantSubdomain) : null,
        };
    },
};
