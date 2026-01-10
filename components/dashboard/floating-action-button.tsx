"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus, X, Package, Truck, FileText, Scan, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAction {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[];
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  showScrollTop?: boolean;
}

const defaultActions: FloatingAction[] = [
  {
    id: "shipment",
    label: "New Shipment",
    icon: Package,
    href: "/dashboard/shipments?action=create",
    color: "bg-primary hover:bg-primary/90",
  },
  {
    id: "manifest",
    label: "New Manifest",
    icon: Truck,
    href: "/dashboard/manifests?action=create",
    color: "bg-amber-500 hover:bg-amber-500/90",
  },
  {
    id: "invoice",
    label: "Generate Invoice",
    icon: FileText,
    href: "/dashboard/invoices?action=create",
    color: "bg-emerald-500 hover:bg-emerald-500/90",
  },
  {
    id: "scan",
    label: "Scan Barcode",
    icon: Scan,
    href: "/dashboard/scanning",
    color: "bg-blue-500 hover:bg-blue-500/90",
  },
];

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
};

export function FloatingActionButton({
  actions = defaultActions,
  position = "bottom-right",
  showScrollTop = true,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position])}>
      <div className="flex flex-col items-center gap-3">
        {/* Action items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-2"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                const content = (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      y: 10,
                      transition: { delay: (actions.length - index) * 0.03 }
                    }}
                    className="flex items-center gap-3"
                  >
                    <span className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium text-foreground shadow-lg whitespace-nowrap">
                      {action.label}
                    </span>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white transition-all",
                        action.color || "bg-primary hover:bg-primary/90"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </motion.div>
                );

                if (action.href) {
                  return (
                    <Link 
                      key={action.id} 
                      href={action.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                  >
                    {content}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && showScroll && !isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg hover:bg-muted/80 transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main FAB button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
            isOpen
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
