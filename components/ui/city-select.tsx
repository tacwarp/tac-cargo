"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CITIES_BY_STATE: Record<string, string[]> = {
  Manipur: [
    "Imphal",
    "Thoubal",
    "Bishnupur",
    "Churachandpur",
    "Kakching",
    "Senapati",
    "Ukhrul",
    "Chandel",
    "Tamenglong",
    "Jiribam",
  ],
  Delhi: [
    "New Delhi",
    "Central Delhi",
    "East Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "Dwarka",
    "Rohini",
    "Pitampura",
    "Janakpuri",
  ],
  Assam: [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Tezpur",
    "Bongaigaon",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bardhaman",
    "Malda",
    "Kharagpur",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Amravati",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Davangere",
    "Bellary",
    "Shimoga",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Gandhinagar",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Bhilwara",
    "Alwar",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Prayagraj",
    "Meerut",
    "Ghaziabad",
    "Noida",
  ],
};

const PRIORITY_CITIES = ["Imphal", "New Delhi"];

interface CitySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  state?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CitySelect({
  value,
  onValueChange,
  state,
  placeholder = "Select city",
  disabled = false,
}: CitySelectProps) {
  const stateCities = state ? CITIES_BY_STATE[state] || [] : [];
  const allCities = Object.values(CITIES_BY_STATE).flat();
  const otherCities = allCities.filter(
    (c) => !PRIORITY_CITIES.includes(c) && !stateCities.includes(c),
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {!state && (
          <SelectGroup>
            <SelectLabel className="text-primary text-xs">
              Frequently Used
            </SelectLabel>
            {PRIORITY_CITIES.map((city) => (
              <SelectItem key={city} value={city} className="font-medium">
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {state && stateCities.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-primary text-xs">{state}</SelectLabel>
            {stateCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {!state && (
          <SelectGroup>
            <SelectLabel className="text-muted-foreground text-xs">
              Other Cities
            </SelectLabel>
            {otherCities.slice(0, 20).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
            {otherCities.length > 20 && (
              <SelectItem
                value="_more"
                disabled
                className="text-muted-foreground italic"
              >
                +{otherCities.length - 20} more cities available
              </SelectItem>
            )}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
