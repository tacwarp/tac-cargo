"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  Truck,
  FileText,
  BarChart3,
  MapPin,
  Scan,
  Users,
  Settings,
  CreditCard,
  AlertCircle,
  HelpCircle,
  Search,
  Plus,
} from "lucide-react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", shortcut: "⌘D" },
  { name: "Shipments", icon: Package, href: "/dashboard/shipments", shortcut: "⌘S" },
  { name: "Tracking", icon: MapPin, href: "/dashboard/tracking", shortcut: "⌘T" },
  { name: "Manifests", icon: Truck, href: "/dashboard/manifests", shortcut: "⌘M" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics", shortcut: "⌘A" },
  { name: "Invoices", icon: FileText, href: "/dashboard/invoices", shortcut: "⌘I" },
  { name: "Payments", icon: CreditCard, href: "/dashboard/payments", shortcut: "⌘P" },
  { name: "Routes", icon: Truck, href: "/dashboard/routes", shortcut: "⌘R" },
  { name: "Scanner", icon: Scan, href: "/dashboard/scanning" },
  { name: "Customers", icon: Users, href: "/dashboard/customers" },
  { name: "Exceptions", icon: AlertCircle, href: "/dashboard/exceptions" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const quickActions = [
  { name: "Create New Shipment", icon: Plus, href: "/dashboard/shipments?action=create" },
  { name: "Create Manifest", icon: Plus, href: "/dashboard/manifests?action=create" },
  { name: "Generate Invoice", icon: Plus, href: "/dashboard/invoices?action=create" },
  { name: "Scan Barcode", icon: Scan, href: "/dashboard/scanning" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const runCommand = React.useCallback((command: () => void) => {
    setIsOpen(false);
    command();
  }, [setIsOpen]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            {quickActions.map((item) => (
              <CommandItem
                key={item.href}
                value={item.name}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4 text-primary" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.name}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Help">
            <CommandItem
              value="documentation"
              onSelect={() => runCommand(() => window.open("/docs", "_blank"))}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem
              value="keyboard shortcuts"
              onSelect={() => runCommand(() => {})}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function CommandPaletteButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground",
          "rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
