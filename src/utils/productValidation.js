
import * as Yup from "yup";

// Product validation schema matching the Joi backend schema
export const createProductSchema = Yup.object({
    // Product name (mapped from backend 'name' field, displayed as 'title' in frontend)
    title: Yup.string()
        .trim()
        .required("Product name is required.")
        .min(1, "Product name is required."),

    // Category
    category: Yup.string()
        .required("Category is required."),

    // Base SKU
    sku: Yup.string()
        .trim()
        .when('hasSku', {
            is: true,
            then: (schema) => schema.required("Base SKU is required."),
            otherwise: (schema) => schema.notRequired()
        }),

    // Description
    description: Yup.string()
        .trim()
        .required("Product description is required."),

    // Has Variants (boolean)
    hasVariants: Yup.boolean().default(false),

    // Variant Options (conditional based on hasVariants)
    variantOptions: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Variant name is required"),
                value: Yup.array()
                    .of(Yup.string().required("Variant value is required"))
                    .min(1, "At least one variant value is required")
                    .required("Variant values are required")
            })
        )
        .when('hasVariants', {
            is: true,
            then: (schema) => schema.min(1, "At least one variant option is required when variants are enabled").required("Variant options are required when variants are enabled"),
            otherwise: (schema) => schema.notRequired()
        }),

    // Status
    status: Yup.string()
        .oneOf(['active', 'draft', 'archived', 'Active', 'Draft', 'Archived', 'Inactive'], "Invalid status")
        .default('draft'),

    // Publishing status
    publishing: Yup.string()
        .oneOf(['Draft', 'Published', 'Hidden'], "Invalid publishing status")
        .required("Publishing status is required"),

    // Images/Media (will be transformed to images array with url/altText for backend)
    media: Yup.array()
        .of(
            Yup.string().url("Invalid image URL") // S3 URLs from upload
        )
        .nullable(),

    // Price (optional, positive number)
    price: Yup.number()
        .positive("Price must be a positive number.")
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    // Compare at price (optional)
    compareAtPrice: Yup.number()
        .positive("Compare at price must be a positive number.")
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    // Cost per item (optional)
    costPerItem: Yup.number()
        .min(0, "Cost per item cannot be negative.")
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    // Stock/Quantity (frontend shows as 'qty', backend expects 'stock')
    qty: Yup.number()
        .integer("Stock must be an integer.")
        .min(0, "Stock cannot be negative.")
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    // Track quantity toggle
    trackQty: Yup.boolean().default(false),

    // Continue selling when out of stock
    continueSelling: Yup.boolean().default(false),

    // Has SKU toggle
    hasSku: Yup.boolean().default(false),

    // Vendor information (frontend-specific fields)
    vendorName: Yup.string()
        .trim()
        .required("Vendor name is required."),

    storeName: Yup.string()
        .trim()
        .required("Store name is required."),

    address: Yup.string()
        .trim()
        .required("Address is required.")
});

// Validation schema for editing products (might have different requirements)
export const editProductSchema = createProductSchema.clone();

// Helper function to validate individual fields
export const validateProductField = (fieldName, value, allValues = {}) => {
    try {
        const fieldSchema = createProductSchema.fields[fieldName];
        if (!fieldSchema) return null;
        
        fieldSchema.validateSync(value, { context: allValues });
        return null; // No error
    } catch (error) {
        return error.message;
    }
};

// Helper function to get validation errors for the entire form
export const validateProductForm = async (values) => {
    try {
        await createProductSchema.validate(values, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (error) {
        const errors = {};
        if (error.inner) {
            error.inner.forEach((err) => {
                errors[err.path] = err.message;
            });
        }
        return { isValid: false, errors };
    }
};

// Default initial values for product forms
export const defaultProductValues = {
    title: "",
    description: "",
    category: "",
    status: "Active",
    publishing: "",
    vendorName: "",
    storeName: "",
    address: "",
    media: [],
    price: "",
    compareAtPrice: "",
    costPerItem: "",
    qty: "",
    trackQty: false,
    continueSelling: false,
    hasSku: true, // Set to true since SKU is always required
    sku: "", // Will be auto-generated if empty
    hasVariants: false,
    variantOptions: []
};
