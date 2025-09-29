import { getLanguageFromCookie, setLanguageInCookie } from "./cookieUtils";

export const migrateLanguageFromLocalStorageToCookie = () => {
  try {
    // Check if we already have language in cookie
    const cookieLanguage = getLanguageFromCookie();

    // If no cookie but localStorage has language, migrate it
    if (!cookieLanguage) {
      const localStorageLanguage = localStorage.getItem("i18nextLng");

      if (localStorageLanguage && ["en", "nl"].includes(localStorageLanguage)) {
        // Set language in cookie
        setLanguageInCookie(localStorageLanguage);

        // Optionally remove from localStorage to complete migration
        localStorage.removeItem("i18nextLng");

        console.log(
          `Migrated language preference "${localStorageLanguage}" from localStorage to cookie`
        );
        return localStorageLanguage;
      }
    }
    return cookieLanguage;
  } catch (error) {
    console.warn(
      "Failed to migrate language preference from localStorage to cookie:",
      error
    );
    return null;
  }
};
