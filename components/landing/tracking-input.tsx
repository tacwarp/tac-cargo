"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackingInput({ className }: { className?: string }) {
  const [awb, setAwb] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (awb.trim()) {
      router.push(`/dashboard/tracking?awb=${encodeURIComponent(awb.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleTrack}
      className={`flex w-full max-w-sm items-center space-x-2 ${className}`}
    >
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          placeholder="Enter AWB or Consignment ID"
          className="bg-background/80 focus-visible:ring-primary h-12 border-white/10 pl-9 backdrop-blur-sm"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-6">
        Track
      </Button>
    </form>
  );
}
