import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setLanguage,
  toggleLanguage,
  selectCurrentLanguage,
  selectAvailableLanguages,
  selectLanguageLabels,
  selectLanguageFlags,
} from "../../store/features/language/language.slice";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LanguageToggle = ({ variant = "dropdown", className = "" }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentLanguage = useSelector(selectCurrentLanguage);
  const availableLanguages = useSelector(selectAvailableLanguages);
  const languageLabels = useSelector(selectLanguageLabels);
  const languageFlags = useSelector(selectLanguageFlags);

  const handleLanguageChange = (newLanguage) => dispatch(setLanguage(newLanguage));
  const handleToggle = () => dispatch(toggleLanguage());

  if (variant === "toggle") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className={`flex items-center gap-2 ${className}`}
        title={t("common.language")}
      >
        <img
          src={languageFlags[currentLanguage]}
          alt=""
          aria-hidden="true"
          className="object-cover w-5 h-4"
        />
        <span className="hidden sm:inline">
          {languageLabels[currentLanguage]}
        </span>
      </Button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors ${className}`}
        title={t("common.language")}
      >
        <img
          src={languageFlags[currentLanguage]}
          alt=""
          aria-hidden="true"
          className="object-cover w-4 h-3"
        />
        <span className="text-xs font-medium">{currentLanguage.toUpperCase()}</span>
      </button>
    );
  }

  // Default: dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <img
            src={languageFlags[currentLanguage]}
            alt=""
            aria-hidden="true"
            className="object-cover w-5 h-4"
          />
          <span className="hidden sm:inline">
            {languageLabels[currentLanguage]}
          </span>
          <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      {/* IMPORTANT: high z-index so it stacks above sticky header */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[2000] min-w-[180px] rounded-xl border border-gray-200 bg-white p-1
                   shadow-[0_12px_24px_rgba(0,0,0,.12)]"
      >
        {availableLanguages.map((lang) => {
          const active = currentLanguage === lang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5
                          focus:bg-[#E9F0FF] focus:text-[#1D50AB]
                          ${active ? "bg-gray-100" : ""}`}
            >
              <img
                src={languageFlags[lang]}
                alt=""
                aria-hidden="true"
                className="object-cover w-5 h-4"
              />
              <span className="flex-1">{languageLabels[lang]}</span>
              {active && <span className="text-sm text-blue-600">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
