import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  countryCodes,
  defaultCountry,
  getCountryByCode,
  formatPhoneNumberOnly,
} from "../../data/countryCodes";
import { validatePhoneWithCountry } from "../../utils/validation";

const PhoneInput = ({
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  className = "",
  error = false,
  onValidationChange, // New prop to send validation errors to parent
}) => {
  // Extract country code from current value or use default
  const getCurrentCountry = () => {
    if (!value) return defaultCountry;

    // Find matching country code (longest match first)
    const sortedCodes = [...countryCodes].sort(
      (a, b) => b.code.length - a.code.length
    );
    const matchingCountry = sortedCodes.find((country) =>
      value.startsWith(country.code)
    );

    return matchingCountry || defaultCountry;
  };

  const [selectedCountry, setSelectedCountry] = useState(getCurrentCountry());

  // Get the phone number part without country code for display
  const getPhoneNumberOnly = () => {
    if (!value) return "";
    return value.replace(/^\+\d+\s*/, "");
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);

    // Get the phone number without country code
    const phoneOnly = getPhoneNumberOnly();

    // Create new full value with new country code
    const newValue = phoneOnly
      ? `${country.code} ${phoneOnly}`
      : country.code + " ";
    onChange(newValue);

    // Validate with new country
    if (onValidationChange && phoneOnly) {
      const validationErrors = validatePhoneWithCountry(newValue, country);
      onValidationChange(validationErrors);
    }
  };

  const handlePhoneInput = (e) => {
    const inputValue = e.target.value;

    // Format the phone number without country code
    const formattedPhoneOnly = formatPhoneNumberOnly(
      inputValue,
      selectedCountry.code
    );

    // Create the full value with country code for storage but don't show it in input
    const fullValue = formattedPhoneOnly
      ? `${selectedCountry.code} ${formattedPhoneOnly}`
      : selectedCountry.code + " ";

    onChange(fullValue);

    // Validate the phone number
    if (onValidationChange) {
      const validationErrors = validatePhoneWithCountry(
        fullValue,
        selectedCountry
      );
      onValidationChange(validationErrors);
    }
  };

  const handleKeyDown = (e) => {
    // Call parent onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex">
      {/* Country Code Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={`flex items-center gap-2 rounded-r-none border-r-0 px-3 ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          >
            {selectedCountry.flag ? (
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.country}
                className="w-4 h-3 object-cover"
              />
            ) : (
              <div className="w-4 h-3 bg-gray-200 rounded-sm flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  {selectedCountry.iso}
                </span>
              </div>
            )}
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="z-[10000] min-w-[250px] max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1
                     shadow-[0_12px_24px_rgba(0,0,0,.12)]"
        >
          {countryCodes.map((country) => {
            const isSelected = selectedCountry.code === country.code;
            return (
              <DropdownMenuItem
                key={country.code}
                onClick={() => handleCountryChange(country)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5
                            focus:bg-[#E9F0FF] focus:text-[#1D50AB]
                            ${isSelected ? "bg-gray-100" : ""}`}
              >
                {country.flag ? (
                  <img
                    src={country.flag}
                    alt={country.country}
                    className="w-5 h-4 object-cover"
                  />
                ) : (
                  <div className="w-5 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-gray-500">{country.iso}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{country.country}</div>
                  <div className="text-xs text-gray-500">{country.code}</div>
                </div>
                {isSelected && <span className="text-blue-600 text-sm">✓</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Phone Number Input */}
      <Input
        type="tel"
        placeholder={placeholder || "XXX XXX XXX"}
        value={getPhoneNumberOnly()}
        onChange={handlePhoneInput}
        onKeyDown={handleKeyDown}
        className={`rounded-l-none ${className} ${
          error ? "border-red-500" : "focus:ring-2 focus:ring-blue-300"
        }`}
      />
    </div>
  );
};

export default PhoneInput;
