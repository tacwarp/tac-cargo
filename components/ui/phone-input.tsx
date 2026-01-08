"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
}

export function PhoneInput({
  value = "",
  onChange,
  countryCode = "+91",
  className,
  ...props
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formatted = rawValue.slice(0, 10);
    onChange?.(formatted);
  };

  const displayValue = value ? value.replace(/(\d{5})(\d{5})/, "$1 $2") : "";

  return (
    <div className="flex">
      <div className="bg-muted text-muted-foreground flex items-center justify-center rounded-l-md border border-r-0 px-3 text-sm font-medium">
        {countryCode}
      </div>
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        className={cn("rounded-l-none", className)}
        placeholder="98765 43210"
        maxLength={11}
        {...props}
      />
    </div>
  );
}
