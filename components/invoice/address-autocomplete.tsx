"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INDIAN_CITIES,
  INDIAN_STATES,
  PRIORITY_CITIES,
  type City,
} from "@/lib/invoice/indian-cities";

export interface AddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface AddressAutocompleteProps {
  value: AddressData;
  onChange: (data: AddressData) => void;
  label?: string;
  required?: boolean;
  errors?: Partial<Record<keyof AddressData, string>>;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  label = "Address",
  required = false,
  errors = {},
  className,
}: AddressAutocompleteProps) {
  const [citySearch, setCitySearch] = useState(value.city || "");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search - use useMemo instead of useEffect+setState
  const filteredCities = useMemo(() => {
    if (citySearch.length === 0) {
      return PRIORITY_CITIES;
    }
    const search = citySearch.toLowerCase();
    const filtered = INDIAN_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(search) ||
        city.state.toLowerCase().includes(search)
    );
    // Prioritize exact matches and priority cities
    filtered.sort((a, b) => {
      const aIsPriority = PRIORITY_CITIES.some((p) => p.name === a.name);
      const bIsPriority = PRIORITY_CITIES.some((p) => p.name === b.name);
      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return a.name.localeCompare(b.name);
    });
    return filtered.slice(0, 10);
  }, [citySearch]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: City) => {
    onChange({
      ...value,
      city: city.name,
      state: city.state,
      pincode: city.pincode || value.pincode,
    });
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleStateChange = (stateCode: string) => {
    const state = INDIAN_STATES.find((s) => s.code === stateCode);
    if (state) {
      onChange({
        ...value,
        state: state.name,
      });
    }
  };

  const updateField = (field: keyof AddressData, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{label}</span>
          {required && <span className="text-destructive">*</span>}
        </div>
      )}

      {/* Street Address */}
      <div className="space-y-2">
        <Label>Street Address {required && "*"}</Label>
        <Input
          value={value.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Building name, Street, Area"
          className={cn(errors.address && "border-destructive")}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      {/* City with Autocomplete */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 relative" ref={dropdownRef}>
          <Label>City {required && "*"}</Label>
          <Input
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="Search city..."
            className={cn(errors.city && "border-destructive")}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}

          {/* City Dropdown */}
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCities.map((city) => (
                <button
                  key={`${city.name}-${city.stateCode}`}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between",
                    value.city === city.name && "bg-accent"
                  )}
                >
                  <div>
                    <span className="font-medium">{city.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {city.state}
                    </span>
                  </div>
                  {PRIORITY_CITIES.some((p) => p.name === city.name) && (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      Priority
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State Dropdown */}
        <div className="space-y-2">
          <Label>State {required && "*"}</Label>
          <Select
            value={
              INDIAN_STATES.find((s) => s.name === value.state)?.code || ""
            }
            onValueChange={handleStateChange}
          >
            <SelectTrigger
              className={cn(errors.state && "border-destructive")}
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state}</p>
          )}
        </div>
      </div>

      {/* Pincode */}
      <div className="w-1/2">
        <div className="space-y-2">
          <Label>PIN Code {required && "*"}</Label>
          <Input
            value={value.pincode}
            onChange={(e) => {
              // Only allow numbers, max 6 digits
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              updateField("pincode", val);
            }}
            placeholder="6-digit PIN"
            maxLength={6}
            className={cn(errors.pincode && "border-destructive")}
          />
          {errors.pincode && (
            <p className="text-xs text-destructive">{errors.pincode}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddressAutocomplete;
