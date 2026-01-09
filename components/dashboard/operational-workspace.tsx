"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

/**
 * Three-Zone Layout for Operational Workspaces
 * Based on PDR: Header + Smart Form + Live Preview
 */

interface WorkspaceHeaderProps {
  title: string;
  status?: "draft" | "ready" | "error" | "processing";
  identifier?: string;
  secondaryIdentifier?: string;
  barcode?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground border-muted",
  ready: "bg-success/10 text-success border-success/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  processing: "bg-info/10 text-info border-info/20",
};

export function WorkspaceHeader({
  title,
  status = "draft",
  identifier,
  secondaryIdentifier,
  barcode,
  actions,
  className,
}: WorkspaceHeaderProps) {
  return (
    <div
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-6 py-4 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <Badge
              variant="outline"
              className={cn("capitalize", statusStyles[status])}
            >
              {status}
            </Badge>
          </div>
          {(identifier || secondaryIdentifier) && (
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
              {identifier && <span className="font-mono">{identifier}</span>}
              {secondaryIdentifier && (
                <>
                  <span className="text-border">•</span>
                  <span className="font-mono">{secondaryIdentifier}</span>
                </>
              )}
            </div>
          )}
        </div>
        {barcode}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceLayout({ children, className }: WorkspaceLayoutProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>{children}</div>
  );
}

interface WorkspaceBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceBody({ children, className }: WorkspaceBodyProps) {
  return (
    <div
      className={cn(
        "grid flex-1 gap-6 p-6 lg:grid-cols-[1fr,400px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface SmartFormPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function SmartFormPanel({ children, className }: SmartFormPanelProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

interface LivePreviewPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function LivePreviewPanel({
  children,
  className,
}: LivePreviewPanelProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon,
  summary,
  defaultOpen = false,
  children,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 cursor-pointer pb-3 transition-colors select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon}
                <CardTitle className="text-base font-medium">{title}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                {!isOpen && summary && (
                  <span className="text-muted-foreground text-sm">
                    {summary}
                  </span>
                )}
                {isOpen ? (
                  <ChevronUpIcon className="text-muted-foreground size-4" />
                ) : (
                  <ChevronDownIcon className="text-muted-foreground size-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

interface PreviewCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function PreviewCard({
  title,
  icon,
  children,
  className,
  actions,
}: PreviewCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface CostBreakdownProps {
  items: { label: string; value: number; highlight?: boolean }[];
  total: number;
  currency?: string;
}

export function CostBreakdown({
  items,
  total,
  currency = "₹",
}: CostBreakdownProps) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between text-sm",
            item.highlight && "text-foreground font-medium",
          )}
        >
          <span className="text-muted-foreground">{item.label}</span>
          <span className={item.highlight ? "text-foreground" : "font-mono"}>
            {currency}
            {item.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
      <div className="border-t pt-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Grand Total</span>
          <span className="text-primary text-lg font-bold">
            {currency}
            {total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

interface FormFieldGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormFieldGroup({
  children,
  columns = 2,
  className,
}: FormFieldGroupProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}
