"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function DualCalendarWithPreset({ className }: { className?: string }) {
    const [date, setDate] = React.useState<Date | undefined>(
        new Date(2025, 5, 12)
    );

    return (
        <Calendar
            mode="single"
            defaultMonth={date}
            numberOfMonths={2}
            selected={date}
            onSelect={setDate}
            className={cn("rounded-lg border shadow-sm", className)}
        />
    );
}

export default DualCalendarWithPreset;
