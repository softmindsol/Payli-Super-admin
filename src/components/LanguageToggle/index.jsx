import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Static language list with flags
const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  // Add more languages as needed
];

export default function LanguageToggle({ variant = "dropdown", className = "" }) {
  // Get current language from localStorage or default to 'en'
  const currentCode = localStorage.getItem("language") || "en";
  const current = LANGS.find((l) => currentCode.startsWith(l.code)) || LANGS[0];

  const [language, setLanguage] = useState(current);

  useEffect(() => {
    // Persist language in localStorage
    localStorage.setItem("language", language.code);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={() => {
          // Cycle through languages in compact mode
          const idx = LANGS.findIndex((l) => l.code === language.code);
          const next = LANGS[(idx + 1) % LANGS.length];
          changeLanguage(next);
        }}
        className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 ${className}`}
        title="Change language"
      >
        <span className="text-base">{language.flag}</span>
        <span className="hidden sm:inline">{language.label}</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`flex items-center gap-2 ${className}`}>
          <span className="text-base">{language.flag}</span>
          <span className="hidden sm:inline">{language.label}</span>
          <span className="sm:hidden">{language.code.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[2000] min-w-[180px] rounded-xl border border-gray-200 bg-white p-1 shadow-[0_12px_24px_rgba(0,0,0,.12)]"
      >
        {LANGS.map((lang) => {
          const active = language.code === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5
                focus:bg-[#E9F0FF] focus:text-[#1D50AB]
                ${active ? "bg-gray-100" : ""}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {active && <span className="text-sm text-blue-600">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
