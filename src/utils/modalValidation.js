/**
 * Universal Modal Validation Utilities
 * Provides consistent validation patterns across all modal forms
 */
import * as Yup from "yup";

// Common validation patterns
export const commonValidation = {
    // Text field validations
    name: Yup.string()
        .trim()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),

    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),

    phone: Yup.string()
        .trim()
        .required("Phone number is required")
        .matches(
            /^\+32[0-9]{8,9}$/,
            "Please enter a valid Belgium phone number (+32XXXXXXXXX)"
        ),

    address: Yup.string()
        .trim()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address must be less than 200 characters"),

    description: Yup.string()
        .trim()
        .max(500, "Description must be less than 500 characters"),

    // Required text with custom min/max
    requiredText: (fieldName, min = 2, max = 100) =>
        Yup.string()
            .trim()
            .required(`${fieldName} is required`)
            .min(min, `${fieldName} must be at least ${min} characters`)
            .max(max, `${fieldName} must be less than ${max} characters`),

    // Optional text with max length
    optionalText: (max = 200) =>
        Yup.string()
            .trim()
            .max(max, `Must be less than ${max} characters`),

    // File validations
    file: {
        required: (allowedTypes = [], maxSizeMB = 10) =>
            Yup.mixed()
                .required("Please select a file")
                .test(
                    "fileType",
                    `Please select a valid file (${allowedTypes.join(", ")})`,
                    (value) => {
                        if (!value) return false;
                        if (allowedTypes.length === 0) return true;
                        return allowedTypes.some(type =>
                            value.type === type ||
                            (value.name && value.name.toLowerCase().endsWith(type.split('/')[1]))
                        );
                    }
                )
                .test(
                    "fileSize",
                    `File size must be less than ${maxSizeMB}MB`,
                    (value) => !value || value.size <= maxSizeMB * 1024 * 1024
                ),

        optional: (allowedTypes = [], maxSizeMB = 5) =>
            Yup.mixed()
                .nullable()
                .test(
                    "fileType",
                    `Please select a valid file (${allowedTypes.join(", ")})`,
                    (value) => {
                        if (!value) return true;
                        if (allowedTypes.length === 0) return true;
                        return allowedTypes.some(type =>
                            value.type === type ||
                            (value.name && value.name.toLowerCase().endsWith(type.split('/')[1]))
                        );
                    }
                )
                .test(
                    "fileSize",
                    `File size must be less than ${maxSizeMB}MB`,
                    (value) => !value || value.size <= maxSizeMB * 1024 * 1024
                ),

        image: (maxSizeMB = 5) =>
            Yup.mixed()
                .nullable()
                .test(
                    "fileType",
                    "Please select a valid image file (PNG, JPG, JPEG, SVG)",
                    (value) => {
                        if (!value) return true;
                        return ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(value.type);
                    }
                )
                .test(
                    "fileSize",
                    `Image size must be less than ${maxSizeMB}MB`,
                    (value) => !value || value.size <= maxSizeMB * 1024 * 1024
                ),

        csv: (maxSizeMB = 10) =>
            Yup.mixed()
                .required("Please select a CSV file")
                .test(
                    "fileType",
                    "Please select a valid CSV file",
                    (value) => {
                        if (!value) return false;
                        return value.type === "text/csv" ||
                            (value.name && value.name.toLowerCase().endsWith(".csv"));
                    }
                )
                .test(
                    "fileSize",
                    `File size must be less than ${maxSizeMB}MB`,
                    (value) => !value || value.size <= maxSizeMB * 1024 * 1024
                ),
    },

    // Select field validation
    select: (fieldName, options = []) => {
        const baseValidation = Yup.string().required(`Please select ${fieldName.toLowerCase()}`);

        if (options && options.length > 0) {
            return baseValidation.oneOf(options, `Invalid ${fieldName.toLowerCase()} selected`);
        }

        return baseValidation;
    },    // Boolean field validation
    boolean: Yup.boolean(),

    // Number field validations
    number: {
        required: (fieldName, min = 0, max = Number.MAX_SAFE_INTEGER) =>
            Yup.number()
                .required(`${fieldName} is required`)
                .min(min, `${fieldName} must be at least ${min}`)
                .max(max, `${fieldName} must be at most ${max}`),

        optional: (min = 0, max = Number.MAX_SAFE_INTEGER) =>
            Yup.number()
                .nullable()
                .min(min, `Must be at least ${min}`)
                .max(max, `Must be at most ${max}`),

        positive: (fieldName) =>
            Yup.number()
                .required(`${fieldName} is required`)
                .positive(`${fieldName} must be a positive number`),

        currency: (fieldName) =>
            Yup.number()
                .required(`${fieldName} is required`)
                .min(0, `${fieldName} cannot be negative`)
                .test(
                    "decimal",
                    `${fieldName} can have at most 2 decimal places`,
                    (value) => !value || Number.isInteger(value * 100)
                ),
    },

    // URL validation
    url: (fieldName = "URL") =>
        Yup.string()
            .trim()
            .url(`Please enter a valid ${fieldName}`)
            .required(`${fieldName} is required`),

    optionalUrl: (fieldName = "URL") =>
        Yup.string()
            .trim()
            .url(`Please enter a valid ${fieldName}`),

    // Date validation
    date: {
        required: (fieldName = "Date") =>
            Yup.date()
                .required(`${fieldName} is required`)
                .typeError(`Please enter a valid ${fieldName.toLowerCase()}`),

        future: (fieldName = "Date") =>
            Yup.date()
                .required(`${fieldName} is required`)
                .min(new Date(), `${fieldName} must be in the future`)
                .typeError(`Please enter a valid ${fieldName.toLowerCase()}`),

        past: (fieldName = "Date") =>
            Yup.date()
                .required(`${fieldName} is required`)
                .max(new Date(), `${fieldName} must be in the past`)
                .typeError(`Please enter a valid ${fieldName.toLowerCase()}`),
    },

    // Password validation
    password: {
        basic: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),

        strong: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),

        confirm: (passwordField = "password") =>
            Yup.string()
                .required("Please confirm your password")
                .oneOf([Yup.ref(passwordField)], "Passwords must match"),
    },
};

// Pre-built validation schemas for common modal types
export const modalSchemas = {
    // Employee forms
    employee: {
        add: Yup.object().shape({
            name: commonValidation.name,
            email: commonValidation.email,
            phone: Yup.string()
                .required("Phone number is required")
                .test("phone-validation", "Please enter a valid phone number", function (value) {
                    // This will be validated by the PhoneInput component
                    // We just need to ensure it's not empty here
                    return value && value.trim().length > 3;
                }),
            role: commonValidation.select("Role", ["Admin", "Manager", "Cashier"]),
            posAddress: Yup.array()
                .of(Yup.string())
                .min(1, "Please select at least one location")
                .required("POS Location is required"),
        }),

        edit: Yup.object().shape({
            name: commonValidation.name,
            email: commonValidation.email,
            phone: Yup.string()
                .required("Phone number is required")
                .test("phone-validation", "Please enter a valid phone number", function (value) {
                    // This will be validated by the PhoneInput component
                    // We just need to ensure it's not empty here
                    return value && value.trim().length > 3;
                }),
            role: commonValidation.select("Role", ["Admin", "Manager", "Cashier"]),
            posAddress: Yup.array()
                .of(Yup.string())
                .min(1, "Please select at least one location")
                .required("POS Location is required"),
        }),
    },    // Location/Outlet forms
    location: {
        create: Yup.object().shape({
            displayName: commonValidation.requiredText("Display name", 2, 50),
            address: Yup.object().shape({
                address: commonValidation.requiredText("Address", 2, 100),
                city: commonValidation.requiredText("City", 2, 50),
                state: commonValidation.requiredText("State", 2, 50),
                postal_code: commonValidation.requiredText("Postal code", 4, 10),
                country: commonValidation.requiredText("Country", 2, 2),
            }),
        }),

        edit: Yup.object().shape({
            name: commonValidation.requiredText("Address name", 2, 50),
            location: commonValidation.address,
        }),
    },

    // Category forms
    category: {
        add: Yup.object().shape({
            name: commonValidation.requiredText("Category name", 2, 50),
            description: commonValidation.optionalText(200),
        }),
    },

    // File upload forms
    file: {
        csvImport: Yup.object().shape({
            file: commonValidation.file.csv(10),
        }),

        imageUpload: Yup.object().shape({
            file: commonValidation.file.image(5),
        }),
    },

    // Receipt customization
    receipt: {
        customize: Yup.object().shape({
            receiptNumber: commonValidation.requiredText("Receipt number", 1, 20),
            receiptFormat: commonValidation.select("Receipt format", ["RCP-#{RCP-001}", "RCP-#{0001}", "RCP-{YYYY}-{0001}"]),
            headerText: commonValidation.requiredText("Header text", 1, 100),
            footerText: commonValidation.requiredText("Footer text", 1, 200),
            logo: commonValidation.file.image(5),
            showTaxBreakdown: commonValidation.boolean,
            showDiscounts: commonValidation.boolean,
        }),
    },
};

// Helper function to get validation schema for a specific modal
export const getModalSchema = (modalType, subType = null) => {
    if (subType && modalSchemas[modalType] && modalSchemas[modalType][subType]) {
        return modalSchemas[modalType][subType];
    }
    if (modalSchemas[modalType]) {
        return modalSchemas[modalType];
    }
    return null;
};

// Helper function to validate form data manually
export const validateModalForm = async (schema, data) => {
    try {
        await schema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (error) {
        const errors = {};
        error?.inner?.forEach((err) => {
            errors[err.path] = err.message;
        });
        return { isValid: false, errors };
    }
};

// Common error messages
export const errorMessages = {
    required: (field) => `${field} is required`,
    minLength: (field, min) => `${field} must be at least ${min} characters`,
    maxLength: (field, max) => `${field} must be less than ${max} characters`,
    email: "Please enter a valid email address",
    phone: "Please enter a valid Belgium phone number (+32XXXXXXXXX)",
    fileSize: (maxMB) => `File size must be less than ${maxMB}MB`,
    fileType: (types) => `Please select a valid file (${types.join(", ")})`,
    select: (field) => `Please select ${field.toLowerCase()}`,
    number: (field) => `${field} must be a valid number`,
    positive: (field) => `${field} must be a positive number`,
    url: "Please enter a valid URL",
    date: "Please enter a valid date",
    future: "Date must be in the future",
    past: "Date must be in the past",
    passwordMatch: "Passwords must match",
};

export default {
    commonValidation,
    modalSchemas,
    getModalSchema,
    validateModalForm,
    errorMessages,
};
