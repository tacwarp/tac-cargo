"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type EmptyStateType = 
  | "shipments" 
  | "invoices" 
  | "exceptions" 
  | "customers" 
  | "manifests"
  | "tracking"
  | "inventory";

interface IllustratedEmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const emptyStateConfig: Record<EmptyStateType, {
  image: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultActionLabel: string;
  defaultActionHref: string;
}> = {
  shipments: {
    image: "/images/empty-shipments.png",
    defaultTitle: "No shipments found",
    defaultDescription: "Get started by creating your first shipment.",
    defaultActionLabel: "Create Shipment",
    defaultActionHref: "/dashboard/shipments?action=create",
  },
  invoices: {
    image: "/images/empty-invoices.png",
    defaultTitle: "No invoices yet",
    defaultDescription: "Generate invoices from your shipments.",
    defaultActionLabel: "Generate Invoice",
    defaultActionHref: "/dashboard/invoices?action=create",
  },
  exceptions: {
    image: "/images/no-exceptions.png",
    defaultTitle: "No exceptions",
    defaultDescription: "All packages are delivered correctly. Great job!",
    defaultActionLabel: "View Shipments",
    defaultActionHref: "/dashboard/shipments",
  },
  customers: {
    image: "/images/empty-customers.png",
    defaultTitle: "No customers yet",
    defaultDescription: "Add your first customer to get started.",
    defaultActionLabel: "Add Customer",
    defaultActionHref: "/dashboard/customers?action=create",
  },
  manifests: {
    image: "/images/empty-shipments.png",
    defaultTitle: "No manifests found",
    defaultDescription: "Create a manifest to group shipments for delivery.",
    defaultActionLabel: "Create Manifest",
    defaultActionHref: "/dashboard/manifests?action=create",
  },
  tracking: {
    image: "/images/empty-shipments.png",
    defaultTitle: "No shipments to track",
    defaultDescription: "Create shipments to start tracking them.",
    defaultActionLabel: "Create Shipment",
    defaultActionHref: "/dashboard/shipments?action=create",
  },
  inventory: {
    image: "/images/empty-shipments.png",
    defaultTitle: "No inventory items",
    defaultDescription: "Your warehouse is empty. Add shipments to track inventory.",
    defaultActionLabel: "View Shipments",
    defaultActionHref: "/dashboard/shipments",
  },
};

export function IllustratedEmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: IllustratedEmptyStateProps) {
  const config = emptyStateConfig[type];
  
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;
  const displayActionLabel = actionLabel || config.defaultActionLabel;
  const displayActionHref = actionHref || config.defaultActionHref;

  const actionButtonContent = (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
      <Plus className="w-4 h-4" />
      {displayActionLabel}
    </div>
  );

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="relative w-48 h-48 mb-6">
        <Image
          src={config.image}
          alt={displayTitle}
          fill
          sizes="192px"
          className="object-contain"
          priority={false}
        />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
        {displayTitle}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
        {displayDescription}
      </p>

      {type !== "exceptions" && (
        onAction ? (
          <button onClick={onAction}>
            {actionButtonContent}
          </button>
        ) : (
          <Link href={displayActionHref}>
            {actionButtonContent}
          </Link>
        )
      )}
    </div>
  );
}

export { emptyStateConfig };
export type { EmptyStateType };
