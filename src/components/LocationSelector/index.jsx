import React from "react";
import { useTranslation } from "react-i18next";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MapPin, ChevronDown } from "lucide-react";

const LocationSelector = ({ variant = "dropdown", className = "" }) => {
  const { t } = useTranslation();
  const { currentLocation, locations, loading, changeLocation } =
    useLocationSelector();

  const handleLocationChange = (newLocation) => {
    changeLocation(newLocation);
  };

  // Helper function to format address object
  const formatAddress = (address) => {
    if (!address || typeof address !== "object") return "";

    const parts = [];
    if (address.address) parts.push(address.address);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postal_code) parts.push(address.postal_code);
    if (address.country) parts.push(address.country);

    return parts.join(", ");
  };

  if (variant === "compact") {
    return (
      <button
        className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors ${className}`}
        title={
          currentLocation?.name || t("common.selectLocation", "Select Location")
        }
        disabled={loading}
      >
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-xs font-medium truncate max-w-20">
          {currentLocation?.name || "Location"}
        </span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
          disabled={loading}
        >
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="hidden truncate sm:inline max-w-32">
            {currentLocation?.name ||
              t("common.selectLocation", "Select Location")}
          </span>
          <span className="truncate sm:hidden max-w-16">
            {currentLocation?.name || "Location"}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      {/* ✅ Added z-index + styling for consistency */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[2000] min-w-[200px] max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1
                   shadow-[0_12px_24px_rgba(0,0,0,.12)]"
      >
        {loading ? (
          <DropdownMenuItem disabled>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-blue-600 animate-spin"></div>
              <span>Loading locations...</span>
            </div>
          </DropdownMenuItem>
        ) : locations?.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-gray-500">No locations available</span>
          </DropdownMenuItem>
        ) : (
          locations?.map((location) => (
            <DropdownMenuItem
              key={location._id}
              onClick={() => handleLocationChange(location)}
              className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5
                          focus:bg-[#E9F0FF] focus:text-[#1D50AB]
                          ${
                            currentLocation?._id === location._id
                              ? "bg-gray-100"
                              : ""
                          }`}
            >
              <MapPin className="w-4 h-4 text-gray-600" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{location.name}</div>
                {location.address && (
                  <div className="text-xs text-gray-500 truncate">
                    {formatAddress(location.address)}
                  </div>
                )}
              </div>
              {currentLocation?._id === location._id && (
                <span className="text-sm text-blue-600">✓</span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationSelector;
