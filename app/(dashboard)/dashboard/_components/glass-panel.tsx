import { cn } from "@/lib/utils";
import React from "react";

export function GlassPanel({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl p-5 relative overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
