import Cookies from "js-cookie";

class CookieLanguageDetector {
  constructor(services, options = {}) {
    this.type = "languageDetector";
    this.services = services;
    this.options = {
      cookieName: "i18nextLng",
      cookieOptions: {
        expires: 365, // 1 year
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
      },
      order: ["cookie", "navigator"],
      caches: ["cookie"],
      ...options,
    };
  }

  init(services, options = {}) {
    this.services = services;
    this.options = { ...this.options, ...options };
  }

  detect() {
    const { cookieName, order } = this.options;

    for (const source of order) {
      let detected;

      switch (source) {
        case "cookie":
          detected = Cookies.get(cookieName);
          break;
        case "navigator":
          detected = navigator.language || navigator.userLanguage;
          // Extract language code from full locale (e.g., 'en-US' -> 'en')
          if (detected) {
            detected = detected.split("-")[0];
          }
          break;
        default:
          break;
      }

      if (detected && this.isValidLanguage(detected)) {
        return detected;
      }
    }

    return undefined;
  }

  cacheUserLanguage(lng) {
    const { cookieName, cookieOptions, caches } = this.options;

    if (caches.includes("cookie")) {
      Cookies.set(cookieName, lng, cookieOptions);
    }
  }

  isValidLanguage(lng) {
    // Add validation for supported languages
    const supportedLanguages = ["en", "nl"];
    return supportedLanguages.includes(lng);
  }
}

export default CookieLanguageDetector;
