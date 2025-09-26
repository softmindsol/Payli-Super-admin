import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

// Static language list with flags
const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  // Uncomment to add Urdu: { code: "ur", label: "Urdu", flag: "🇵🇰" }
];

export default function LanguageToggle({ variant = "dropdown", className = "" }) {
  // Fetch current language from localStorage or default to 'en'
  const currentCode = localStorage.getItem("language") || "en";
  const current = LANGS.find((l) => currentCode.startsWith(l.code)) || LANGS[0];

  // Change language and persist it in localStorage
  const changeLanguage = (code) => {
    try {
      // Save selected language in localStorage
      localStorage.setItem("language", code);
      // Reload page to apply the new language (can be replaced with your own logic)
      window.location.reload();
    } catch (e) {
      console.error("Failed to change language:", e);
    }
  };

  // For compact version: toggle between languages
  if (variant === "compact") {
    return (
      <button
        onClick={() => {
          // Cycle to next language
          const idx = LANGS.findIndex((l) => l.code === current.code);
          const next = LANGS[(idx + 1) % LANGS.length];
          changeLanguage(next.code);
        }}
        className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 ${className}`}
        title="Change language"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`flex items-center gap-2 ${className}`}>
          <span className="text-base">{current.flag}</span>
          <span className="hidden sm:inline">{current.label}</span>
          <span className="sm:hidden">Lang</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[2000] min-w-[180px] rounded-xl border border-gray-200 bg-white p-1 shadow-[0_12px_24px_rgba(0,0,0,.12)]"
      >
        {LANGS.map((lng) => {
          const active = lng.code === current.code;
          return (
            <DropdownMenuItem
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5
                focus:bg-[#E9F0FF] focus:text-[#1D50AB]
                ${active ? "bg-gray-100" : ""}`}
            >
              <span className="text-base">{lng.flag}</span>
              <span className="flex-1">{lng.label}</span>
              {active && <span className="text-sm text-blue-600">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
