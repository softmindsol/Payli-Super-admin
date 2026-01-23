import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeLanguage } from "../../store/features/language/language.slice";
import { useLanguagePersistence } from "../../hooks/persistance/useLanguagePersistence";
import "../../i18n"; // Import to initialize i18n

/**
 * Language Provider Component
 * Initializes language settings based on domain and user preferences stored in cookies
 */
const LanguageProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { getPersistedLanguage } = useLanguagePersistence();

  useEffect(() => {
    // Initialize language on app startup
    dispatch(initializeLanguage());
  }, [dispatch]);

  // Note: Cookie changes across tabs/windows are not automatically detected
  // like localStorage changes. The language persistence is handled by the
  // useLanguagePersistence hook and cookie-based detection system

  return <>{children}</>;
};

export default LanguageProvider;
