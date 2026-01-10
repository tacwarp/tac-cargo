"use client";

import { FloatingActionButton } from "@/components/dashboard/floating-action-button";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface DashboardProvidersProps {
  children: React.ReactNode;
}

export function DashboardProviders({ children }: DashboardProvidersProps) {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <>
      {children}
      
      {/* Floating Action Button */}
      <FloatingActionButton position="bottom-right" showScrollTop />
    </>
  );
}
