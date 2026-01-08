import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:shadow-primary/10 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:shadow-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
