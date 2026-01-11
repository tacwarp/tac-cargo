"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
  error?: boolean;
  allowInternational?: boolean;
}

/**
 * PhoneInput - Flexible phone number input with country code prefix
 * 
 * Features:
 * - Supports international numbers (when allowInternational is true)
 * - Default country code is +91 (India)
 * - Accepts 10-15 digits for phone numbers
 * - No browser autocomplete to prevent unwanted auto-fill
 * - Formats display for better readability
 * - Returns raw digits via onChange
 */
export function PhoneInput({
  value = "",
  onChange,
  countryCode = "+91",
  className,
  error,
  allowInternational = true,
  ...props
}: PhoneInputProps) {
  const maxDigits = allowInternational ? 15 : 10;
  const minDigits = allowInternational ? 7 : 10;
  
  // Extract only digits from value (in case it contains formatting)
  const rawDigits = value.replace(/\D/g, "").slice(0, maxDigits);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits and limit based on settings
    const digits = e.target.value.replace(/\D/g, "").slice(0, maxDigits);
    onChange?.(digits);
  };

  // Format for display - adaptive based on length
  const formatDisplay = (digits: string): string => {
    if (!digits) return "";
    if (digits.length <= 5) return digits;
    if (digits.length <= 10) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    // For longer international numbers
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  };

  const placeholderText = allowInternational 
    ? "9876543210" 
    : "98765 43210";

  return (
    <div className="flex">
      <div className={cn(
        "flex items-center justify-center rounded-l-md border border-r-0 px-3 text-sm font-medium select-none",
        "bg-muted text-muted-foreground",
        error && "border-destructive"
      )}>
        {countryCode}
      </div>
      <Input
        type="tel"
        inputMode="numeric"
        value={formatDisplay(rawDigits)}
        onChange={handleChange}
        className={cn(
          "rounded-l-none",
          error && "border-destructive",
          className
        )}
        placeholder={placeholderText}
        maxLength={maxDigits + 2} // digits + spaces for formatting
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-form-type="other"
        data-lpignore="true"
        data-testid="phone-input"
        {...props}
      />
    </div>
  );
}

/**
 * Get the full phone number with country code
 * Supports variable length phone numbers (7-15 digits)
 */
export function getFullPhoneNumber(digits: string, countryCode = "+91"): string {
  const clean = digits.replace(/\D/g, "").slice(0, 15);
  if (!clean) return "";
  
  // Format based on length
  if (clean.length <= 10) {
    return `${countryCode} ${clean}`;
  }
  // For longer numbers, add spaces for readability
  return `${countryCode} ${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
}

/**
 * Extract raw digits from a formatted phone number
 */
export function getRawPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If starts with 91 and has more than 10 digits, remove country code
  if (digits.startsWith("91") && digits.length > 10) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(digits: string, allowInternational = true): boolean {
  const clean = digits.replace(/\D/g, "");
  const minLength = allowInternational ? 7 : 10;
  const maxLength = allowInternational ? 15 : 10;
  return clean.length >= minLength && clean.length <= maxLength;
}
