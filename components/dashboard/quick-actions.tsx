"use client";

import { cn } from "@/lib/utils";
import { Plus, Scan, Printer, FileText, Bell, Package } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: "new-shipment",
    label: "New Shipment",
    description: "Create a new shipment",
    icon: Plus,
    href: "/dashboard/shipments?action=create",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    id: "scan",
    label: "Scan Package",
    description: "Scan barcode to update",
    icon: Scan,
    href: "/dashboard/scanning",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  {
    id: "print-labels",
    label: "Print Labels",
    description: "Batch print shipping labels",
    icon: Printer,
    href: "/dashboard/shipments?action=print",
    color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  },
  {
    id: "manifest",
    label: "New Manifest",
    description: "Create delivery manifest",
    icon: Package,
    href: "/dashboard/manifests?action=create",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  },
  {
    id: "invoice",
    label: "Generate Invoice",
    description: "Create customer invoice",
    icon: FileText,
    href: "/dashboard/invoices?action=create",
    color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  },
  {
    id: "notify",
    label: "Send Notifications",
    description: "Bulk notify customers",
    icon: Bell,
    href: "/dashboard/settings?tab=notifications",
    color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
  },
];

export function QuickActions({ actions = defaultActions, className }: QuickActionsProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer",
              "hover:shadow-md hover:scale-[1.02]",
              action.color || "bg-muted/50 hover:bg-muted"
            )}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium text-center">{action.label}</span>
            {action.description && (
              <span className="text-[10px] text-muted-foreground text-center mt-0.5 hidden lg:block">
                {action.description}
              </span>
            )}
          </div>
        );

        if (action.href) {
          return (
            <Link key={action.id} href={action.href}>
              {content}
            </Link>
          );
        }

        return (
          <button key={action.id} onClick={action.onClick} className="text-left">
            {content}
          </button>
        );
      })}
    </div>
  );
}

export { defaultActions };
export type { QuickAction };
