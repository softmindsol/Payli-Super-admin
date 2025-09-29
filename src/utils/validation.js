/**
 * Comprehensive validation utilities for form fields
 */

// Email validation with explicit @ and . requirements
export const validateEmail = (email) => {
    const errors = [];

    if (!email || !email.trim()) {
        errors.push("Email is required");
        return errors;
    }

    const trimmedEmail = email.trim();

    // Check for @ symbol
    if (!trimmedEmail.includes('@')) {
        errors.push("Email must contain an @ symbol");
        return errors;
    }

    // Check for . symbol
    if (!trimmedEmail.includes('.')) {
        errors.push("Email must contain a . (dot) symbol");
        return errors;
    }

    // More specific email format validation
    const emailParts = trimmedEmail.split('@');
    if (emailParts.length !== 2) {
        errors.push("Email must have exactly one @ symbol");
        return errors;
    }

    const [localPart, domainPart] = emailParts;

    // Validate local part (before @)
    if (localPart.length === 0) {
        errors.push("Email must have characters before the @ symbol");
    }

    // Validate domain part (after @)
    if (domainPart.length === 0) {
        errors.push("Email must have a domain after the @ symbol");
    } else if (!domainPart.includes('.')) {
        errors.push("Email domain must contain a . (dot) symbol");
    } else {
        const domainParts = domainPart.split('.');
        if (domainParts.some(part => part.length === 0)) {
            errors.push("Email domain parts cannot be empty");
        }
        const lastPart = domainParts[domainParts.length - 1];
        if (lastPart.length < 2) {
            errors.push("Email domain extension must be at least 2 characters");
        }
    }

    // General email format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.push("Please enter a valid email address format");
    }

    if (trimmedEmail.length > 254) {
        errors.push("Email address is too long");
    }

    return errors;
};

// Phone number validation with support for multiple countries
export const validatePhone = (phone, selectedCountry = null) => {
    const errors = [];

    if (!phone || !phone.trim()) {
        errors.push("Phone number is required");
        return errors;
    }

    const trimmedPhone = phone.trim();

    // Extract country code and phone number
    let countryCode = selectedCountry?.code;
    let phoneNumber = trimmedPhone;

    // If phone includes country code, extract it
    const countryCodeMatch = trimmedPhone.match(/^(\+\d{1,4})\s*/);
    if (countryCodeMatch) {
        countryCode = countryCodeMatch[1];
        phoneNumber = trimmedPhone.replace(/^\+\d{1,4}\s*/, '');
    }

    // If no country code detected, use default or show error
    if (!countryCode) {
        errors.push("Country code is required");
        return errors;
    }

    // Remove any non-digit characters from phone number for validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Validate based on country code
    if (countryCode === '+32') {
        // Belgium validation
        if (cleanPhone.length < 8 || cleanPhone.length > 9) {
            errors.push("Belgium phone number must have 8-9 digits");
            return errors;
        }

        // Belgium mobile numbers: 4XX XXX XXX (9 digits starting with 4)
        // Belgium landline numbers: XX XXX XXXX (8-9 digits, not starting with 4)
        if (cleanPhone.length === 9 && !cleanPhone.startsWith('4')) {
            errors.push("9-digit Belgium numbers must start with 4 (mobile)");
        } else if (cleanPhone.length === 8 && cleanPhone.startsWith('4')) {
            errors.push("Belgium mobile numbers starting with 4 must have 9 digits");
        }

    } else if (countryCode === '+31') {
        // Netherlands validation
        if (cleanPhone.length < 9 || cleanPhone.length > 9) {
            errors.push("Netherlands phone number must have exactly 9 digits");
            return errors;
        }

        // Netherlands mobile numbers: 6XXXXXXXX
        // Netherlands landline numbers: other patterns
        const validPrefixes = ['6', '1', '2', '3', '4', '5', '7', '8', '9'];
        if (!validPrefixes.includes(cleanPhone.charAt(0))) {
            errors.push("Please enter a valid Netherlands phone number");
        }

    } else {
        // Generic validation for other countries
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            errors.push("Phone number must have 7-15 digits");
        }
    }

    return errors;
};

// Validate phone number with country context (new function for the PhoneInput component)
export const validatePhoneWithCountry = (fullPhoneValue, selectedCountry) => {
    return validatePhone(fullPhoneValue, selectedCountry);
};

// Auto-format phone number function for Belgium
export const formatPhoneNumber = (value, previousValue = '') => {
    // Always ensure the value starts with +32
    if (!value || value.length < 3) {
        return '+32 ';
    }

    // If user tries to delete the +32 part, restore it
    if (!value.startsWith('+32')) {
        // Extract only the digits from the current value
        const digits = value.replace(/\D/g, '');
        value = '+32' + digits;
    }

    // Remove all non-digit characters except + and preserve +32
    let cleaned = value.replace(/[^\d+]/g, '');

    // Ensure it starts with +32
    if (!cleaned.startsWith('+32')) {
        if (cleaned.startsWith('32')) {
            cleaned = '+' + cleaned;
        } else if (cleaned.startsWith('+')) {
            // If it starts with + but not +32, fix it
            const digits = cleaned.replace(/^\+/, '');
            cleaned = '+32' + digits;
        } else {
            cleaned = '+32' + cleaned;
        }
    }

    // Extract the digits after +32
    const match = cleaned.match(/^\+32(\d{0,9})/);
    if (match) {
        const digits = match[1];

        // Format as +32 XXX XXX XXX (mobile) or +32 XX XXX XXXX (landline)
        if (digits.length === 0) {
            return '+32 ';
        } else if (digits.length <= 1) {
            return `+32 ${digits}`;
        } else if (digits.length <= 3) {
            return `+32 ${digits}`;
        } else if (digits.length <= 6) {
            return `+32 ${digits.slice(0, 3)} ${digits.slice(3)}`;
        } else if (digits.length <= 9) {
            // For mobile numbers (9 digits): +32 4XX XXX XXX
            if (digits.charAt(0) === '4' && digits.length === 9) {
                return `+32 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
            }
            // For landline numbers (8-9 digits): +32 XX XXX XXXX
            else if (digits.length === 8) {
                return `+32 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`;
            } else {
                return `+32 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
            }
        }
    }

    return '+32 ';
};

// Get clean phone number (digits only after +32)
export const getCleanPhoneNumber = (formattedPhone) => {
    if (!formattedPhone) return '';
    return formattedPhone.replace(/^\+32/, '').replace(/\D/g, '');
};

// Password validation with comprehensive security checks
export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        errors.push("Password is required");
        return errors;
    }

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
        errors.push("Password must be less than 128 characters");
    }

    if (!/(?=.*[a-z])/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
        errors.push("Password must contain at least one special character");
    }

    if (/\s/.test(password)) {
        errors.push("Password must not contain spaces");
    }

    // Check for common weak patterns
    const commonPatterns = [
        /123456/,
        /password/i,
        /qwerty/i,
        /abc123/i,
        /admin/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
        errors.push("Password contains common patterns that are easily guessed");
    }

    return errors;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
    const errors = [];

    if (!confirmPassword) {
        errors.push("Please confirm your password");
        return errors;
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
    }

    return errors;
};

// Name validation (first name, last name)
export const validateName = (name, fieldName = "Name") => {
    const errors = [];

    if (!name || !name.trim()) {
        errors.push(`${fieldName} is required`);
        return errors;
    }

    if (name.trim().length < 2) {
        errors.push(`${fieldName} must be at least 2 characters long`);
    }

    if (name.trim().length > 50) {
        errors.push(`${fieldName} must be less than 50 characters`);
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name.trim())) {
        errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }

    return errors;
};

// Company/Business name validation
export const validateCompanyName = (name) => {
    const errors = [];

    if (!name || !name.trim()) {
        errors.push("Company name is required");
        return errors;
    }

    if (name.trim().length < 2) {
        errors.push("Company name must be at least 2 characters long");
    }

    if (name.trim().length > 100) {
        errors.push("Company name must be less than 100 characters");
    }

    // Allow letters, numbers, spaces, and common business characters
    const companyNameRegex = /^[a-zA-Z0-9\s\-&.,'"()]+$/;
    if (!companyNameRegex.test(name.trim())) {
        errors.push("Company name contains invalid characters");
    }

    return errors;
};

// Business type validation
export const validateBusinessType = (businessType) => {
    const errors = [];

    if (!businessType || !businessType.trim()) {
        errors.push("Business type is required");
        return errors;
    }

    // Define allowed business types (expanded list)
    const allowedTypes = [
        "Retail",
        "Restaurant",
        "Service",
        "Technology",
        "Healthcare",
        "Education",
        "Finance",
        "Real Estate",
        "Manufacturing",
        "Transportation",
        "Entertainment",
        "Agriculture",
        "Construction",
        "Consulting",
        "E-commerce",
        "Other"
    ];

    if (!allowedTypes.includes(businessType)) {
        errors.push("Please select a valid business type");
    }

    return errors;
};

// Business region validation
export const validateBusinessRegion = (region, isRequired = false) => {
    const errors = [];

    if (isRequired && (!region || !region.trim())) {
        errors.push("Business region is required");
        return errors;
    }

    // If region is provided, validate it
    if (region && region.trim()) {
        // Define allowed regions
        const allowedRegions = [
            "Belgium/Netherlands",
            "Germany",
            "France",
            "United Kingdom",
            "Spain",
            "Italy",
            "Portugal",
            "Austria",
            "Switzerland",
            "Netherlands",
            "Belgium",
            "Other"
        ];

        if (!allowedRegions.includes(region)) {
            errors.push("Please select a valid business region");
        }
    }

    return errors;
};

// Get password strength score (0-4)
export const getPasswordStrength = (password) => {
    if (!password) return 0;

    let score = 0;
    const checks = [
        password.length >= 8,
        /(?=.*[a-z])/.test(password),
        /(?=.*[A-Z])/.test(password),
        /(?=.*\d)/.test(password),
        /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)
    ];

    score = checks.filter(Boolean).length;

    // Bonus points for length
    if (password.length >= 12) score = Math.min(score + 1, 4);

    return score;
};

// Get password strength label
export const getPasswordStrengthLabel = (score) => {
    const labels = {
        0: "Very Weak",
        1: "Weak",
        2: "Fair",
        3: "Good",
        4: "Strong"
    };

    return labels[score] || "Very Weak";
};

// Get password strength color
export const getPasswordStrengthColor = (score) => {
    const colors = {
        0: "#ef4444", // red
        1: "#f97316", // orange
        2: "#eab308", // yellow
        3: "#3b82f6", // blue
        4: "#22c55e"  // green
    };

    return colors[score] || "#ef4444";
};

// Real-time validation for forms
export const validateField = (fieldName, value, additionalData = {}) => {
    switch (fieldName) {
        case 'firstName':
            return validateName(value, "First name");
        case 'lastName':
            return validateName(value, "Last name");
        case 'email':
            return validateEmail(value);
        case 'phone':
            return validatePhone(value);
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            return validatePasswordConfirmation(additionalData.password, value);
        case 'companyName':
            return validateCompanyName(value);
        case 'businessType':
            return validateBusinessType(value);
        case 'businessRegion':
            // Business region is optional by default, can be made required by passing isRequired: true in additionalData
            return validateBusinessRegion(value, additionalData.isRequired);
        default:
            return [];
    }
};

// Utility to check if form has any errors
export const hasFormErrors = (errors) => {
    return Object.values(errors).some(fieldErrors =>
        Array.isArray(fieldErrors) ? fieldErrors.length > 0 : Boolean(fieldErrors)
    );
};

// Utility to get first error message for a field
export const getFirstError = (fieldErrors) => {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return fieldErrors[0];
    }
    return fieldErrors || null;
};
