import { domainHandler } from "./domainHandler";

export const shouldRedirectToTenantDomain = (user, currentDomainInfo) => {
    // Safety checks
    if (!user || !currentDomainInfo) {
        console.warn("Missing user or domain info for tenant redirection check");
        return false;
    }
    const hasValidTenantSubdomain = user.tenantSubdomain && typeof user.tenantSubdomain === 'string';
    const isNotAppUser = user.tenantId && user.tenantId !== "app";
    const isOnMainDomain = currentDomainInfo.isMainDomain === true;
    const isDifferentFromCurrentTenant = user.tenantSubdomain !== currentDomainInfo.tenantId;

    return (
        hasValidTenantSubdomain &&
        isNotAppUser &&
        isOnMainDomain &&
        isDifferentFromCurrentTenant
    );
};

export const handleTenantRedirection = (user, currentDomainInfo, targetPath = null) => {
    if (!shouldRedirectToTenantDomain(user, currentDomainInfo)) {
        return false;
    }

    // Use the domain handler to perform the redirect
    domainHandler.redirectToTenantDomain(
        user.tenantSubdomain,
        false, // Not a custom domain
        targetPath // Pass the target path
    );

    return true;
};

export const validateTenantAccess = (user, currentDomainInfo) => {
    if (currentDomainInfo.isMainDomain) {
        return { allowed: true, reason: "main_domain_access" };
    }

    if (currentDomainInfo.isCustomDomain) {
        return { allowed: true, reason: "custom_domain_access" };
    }

    if (currentDomainInfo.isSubdomain) {
        // Check if user is accessing their correct subdomain
        if (user?.tenantSubdomain === currentDomainInfo.tenantId) {
            return { allowed: true, reason: "correct_tenant_subdomain" };
        } else {
            return {
                allowed: false,
                reason: "wrong_tenant_subdomain",
                message: `User authorized for '${user?.tenantSubdomain}' but accessing '${currentDomainInfo.tenantId}'`,
            };
        }
    }

    return { allowed: true, reason: "default_allow" };
};

export const getPostLoginRedirectPath = (user, currentDomainInfo, defaultPath = '/setup') => {
    if (shouldRedirectToTenantDomain(user, currentDomainInfo)) {
        return null;
    }

    return defaultPath;
};
