import { BE, NL } from "../assets/svgs/index.js";

// Common European countries with their phone codes and flags
export const countryCodes = [
    {
        code: "+32",
        country: "Belgium",
        flag: BE, // We'll use a default flag or create one
        iso: "BE"
    },
    {
        code: "+31",
        country: "Netherlands",
        flag: NL,
        iso: "NL"
    },
];

// Comprehensive list of countries for address forms
export const countries = [
    { code: "BE", name: "Belgium" },
    { code: "NL", name: "Netherlands" },
];

// Default country - Belgium
export const defaultCountry = countryCodes[0];

// Helper function to get country by code
export const getCountryByCode = (code) => {
    return countryCodes.find(country => country.code === code) || defaultCountry;
};

// Helper function to format phone number with country code
export const formatPhoneWithCountryCode = (phone, countryCode) => {
    if (!phone) return countryCode + " ";

    // Remove any existing country code if present
    let cleanPhone = phone.replace(/^\+\d+\s*/, "").trim();

    // Remove any non-digit characters except spaces and common separators
    cleanPhone = cleanPhone.replace(/[^\d\s]/g, '');

    // Remove extra spaces
    cleanPhone = cleanPhone.replace(/\s+/g, ' ').trim();

    // If no digits, return just the country code
    if (!cleanPhone || cleanPhone.replace(/\s/g, '') === '') {
        return countryCode + " ";
    }

    // Format based on country code
    const digits = cleanPhone.replace(/\s/g, '');

    if (countryCode === "+32") {
        // Belgium formatting: +32 XXX XXX XXX (mobile) or +32 XX XXX XXXX (landline)
        if (digits.length <= 1) {
            return `${countryCode} ${digits}`;
        } else if (digits.length <= 3) {
            return `${countryCode} ${digits}`;
        } else if (digits.length <= 6) {
            return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3)}`;
        } else if (digits.length <= 9) {
            // For mobile numbers (9 digits starting with 4): +32 4XX XXX XXX
            if (digits.charAt(0) === '4' && digits.length === 9) {
                return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
            }
            // For landline numbers (8-9 digits): +32 XX XXX XXXX
            else if (digits.length === 8) {
                return `${countryCode} ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`;
            } else {
                return `${countryCode} ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
            }
        }
    } else if (countryCode === "+31") {
        // Netherlands formatting: +31 X XXXX XXXX
        if (digits.length <= 1) {
            return `${countryCode} ${digits}`;
        } else if (digits.length <= 5) {
            return `${countryCode} ${digits.slice(0, 1)} ${digits.slice(1)}`;
        } else if (digits.length <= 9) {
            return `${countryCode} ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
        } else {
            return `${countryCode} ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
        }
    }

    // Default formatting for other countries: +XX XXX XXX XXXX
    if (digits.length <= 3) {
        return `${countryCode} ${digits}`;
    } else if (digits.length <= 6) {
        return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
        return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
        return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
};

// Helper function to format phone number WITHOUT country code prefix
export const formatPhoneNumberOnly = (phone, countryCode) => {
    if (!phone) return "";

    // Remove any existing country code if present
    let cleanPhone = phone.replace(/^\+\d+\s*/, "").trim();

    // Remove any non-digit characters except spaces and common separators
    cleanPhone = cleanPhone.replace(/[^\d\s]/g, '');

    // Remove extra spaces
    cleanPhone = cleanPhone.replace(/\s+/g, ' ').trim();

    // If no digits, return empty string
    if (!cleanPhone || cleanPhone.replace(/\s/g, '') === '') {
        return "";
    }

    // Format based on country code but without the prefix
    const digits = cleanPhone.replace(/\s/g, '');

    if (countryCode === "+32") {
        // Belgium formatting: XXX XXX XXX (mobile) or XX XXX XXXX (landline)
        if (digits.length <= 1) {
            return digits;
        } else if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 6) {
            return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        } else if (digits.length <= 9) {
            // For mobile numbers (9 digits starting with 4): 4XX XXX XXX
            if (digits.charAt(0) === '4' && digits.length === 9) {
                return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
            }
            // For landline numbers (8-9 digits): XX XXX XXXX
            else if (digits.length === 8) {
                return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`;
            } else {
                return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
            }
        }
    } else if (countryCode === "+31") {
        // Netherlands formatting: X XXXX XXXX
        if (digits.length <= 1) {
            return digits;
        } else if (digits.length <= 5) {
            return `${digits.slice(0, 1)} ${digits.slice(1)}`;
        } else if (digits.length <= 9) {
            return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
        } else {
            return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
        }
    }

    // Default formatting for other countries: XXX XXX XXXX
    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
};
