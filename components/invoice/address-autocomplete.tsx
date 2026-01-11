"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Check, ChevronsUpDown } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    // If search is empty, show priority cities first
    const cities = citySearch.length === 0 
      ? PRIORITY_CITIES 
      : INDIAN_CITIES.filter(
          (city) =>
            city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
            city.state.toLowerCase().includes(citySearch.toLowerCase())
        );
    
    // Sort logic: Priority cities first, then alphabetical
    return cities.slice(0, 50).sort((a, b) => {
      const aIsPriority = PRIORITY_CITIES.some((p) => p.name === a.name);
      const bIsPriority = PRIORITY_CITIES.some((p) => p.name === b.name);
      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [citySearch]);

  const handleCitySelect = (city: City) => {
    onChange({
      ...value,
      city: city.name,
      state: city.state,
      pincode: city.pincode || value.pincode,
    });
    setOpen(false);
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

      {/* City with Popover + Command */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 flex flex-col">
          <Label>City {required && "*"}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  !value.city && "text-muted-foreground",
                  errors.city && "border-destructive"
                )}
              >
                {value.city || "Select city..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search city..." 
                  value={citySearch}
                  onValueChange={setCitySearch}
                />
                <CommandList>
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    {filteredCities.map((city) => (
                      <CommandItem
                        key={`${city.name}-${city.stateCode}`}
                        value={`${city.name}|${city.state}`}
                        onSelect={() => handleCitySelect(city)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.city === city.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{city.name}</span>
                          <span className="text-xs text-muted-foreground">{city.state}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
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
