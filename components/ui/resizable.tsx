"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
    className,
    direction = "horizontal",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { direction?: "horizontal" | "vertical" }) => (
    <div
        className={cn(
            "flex h-full w-full",
            direction === "vertical" ? "flex-col" : "flex-row",
            className
        )}
        {...props}
    />
)

const ResizablePanel = ({
    className,
    defaultSize,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
}) => (
    <div
        className={cn(
            "flex-1 overflow-hidden",
            className
        )}
        style={{ flexBasis: defaultSize ? `${defaultSize}%` : undefined }}
        {...props}
    />
)

const ResizableHandle = ({
    withHandle,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    withHandle?: boolean
}) => (
    <div
        className={cn(
            "bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
            className
        )}
        {...props}
    >
        {withHandle && (
            <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                <GripVertical className="h-2.5 w-2.5" />
            </div>
        )}
    </div>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
