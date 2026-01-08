"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ScanBarcode } from "lucide-react";

interface TrackingInputProps {
  onTrack: (id: string) => void;
  loading: boolean;
}

export function TrackingInput({ onTrack, loading }: TrackingInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && !loading) onTrack(trimmedValue);
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Input
          placeholder="Enter Tracking / AWB Number"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleSubmit();
          }}
          className="bg-background border-input focus:ring-primary/20 focus:border-primary h-12 pr-12 pl-12 transition-all focus:ring-2"
          autoFocus
        />
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
          title="Scan Barcode (Simulated)"
        >
          <ScanBarcode className="h-4 w-4" />
        </Button>
      </div>
      <Button
        className="hover:shadow-primary/25 h-12 px-8 font-medium shadow-lg transition-all"
        disabled={!value || loading}
        onClick={handleSubmit}
      >
        Track Shipment
      </Button>
    </div>
  );
}
