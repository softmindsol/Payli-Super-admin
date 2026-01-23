// Demo categories data for testing without backend
export const DEMO_CATEGORIES = [
    {
        _id: "cat_1",
        id: "cat_1",
        name: "Electronics",
        description: "Electronic devices and gadgets",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_2",
        id: "cat_2",
        name: "Fashion",
        description: "Clothing and fashion accessories",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_3",
        id: "cat_3",
        name: "Beauty",
        description: "Beauty and cosmetic products",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_4",
        id: "cat_4",
        name: "Home Living",
        description: "Home and living products",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_5",
        id: "cat_5",
        name: "Fitness",
        description: "Fitness and sports equipment",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_6",
        id: "cat_6",
        name: "Digital",
        description: "Digital products and services",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "cat_7",
        id: "cat_7",
        name: "Baby & Kids",
        description: "Products for babies and children",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Utility function to get category name by ID
export const getCategoryNameById = (categoryId, categories = DEMO_CATEGORIES) => {
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || categoryId;
};

// Utility function to get category by ID
export const getCategoryById = (categoryId, categories = DEMO_CATEGORIES) => {
    return categories.find(cat => cat._id === categoryId || cat.id === categoryId);
};
