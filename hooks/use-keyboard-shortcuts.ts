"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

const defaultShortcuts: ShortcutAction[] = [
  { key: "d", ctrl: true, action: () => {}, description: "Go to Dashboard" },
  { key: "s", ctrl: true, action: () => {}, description: "Go to Shipments" },
  { key: "t", ctrl: true, action: () => {}, description: "Go to Tracking" },
  { key: "m", ctrl: true, action: () => {}, description: "Go to Manifests" },
  { key: "a", ctrl: true, action: () => {}, description: "Go to Analytics" },
  { key: "n", ctrl: true, shift: true, action: () => {}, description: "New Shipment" },
  { key: "/", ctrl: true, action: () => {}, description: "Open Search" },
  { key: "k", ctrl: true, action: () => {}, description: "Open Command Palette" },
];

export function useKeyboardShortcuts(customShortcuts?: ShortcutAction[]) {
  const router = useRouter();

  const shortcuts: ShortcutAction[] = useMemo(
    () => [
      { key: "d", ctrl: true, action: () => router.push("/dashboard"), description: "Go to Dashboard" },
      { key: "s", ctrl: true, action: () => router.push("/dashboard/shipments"), description: "Go to Shipments" },
      { key: "t", ctrl: true, action: () => router.push("/dashboard/tracking"), description: "Go to Tracking" },
      { key: "m", ctrl: true, action: () => router.push("/dashboard/manifests"), description: "Go to Manifests" },
      { key: "a", ctrl: true, action: () => router.push("/dashboard/analytics"), description: "Go to Analytics" },
      { key: "i", ctrl: true, action: () => router.push("/dashboard/invoices"), description: "Go to Invoices" },
      { key: "p", ctrl: true, action: () => router.push("/dashboard/payments"), description: "Go to Payments" },
      { key: "r", ctrl: true, action: () => router.push("/dashboard/routes"), description: "Go to Routes" },
      ...(customShortcuts || []),
    ],
    [router, customShortcuts],
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find((shortcut) => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      
      return keyMatch && ctrlMatch && altMatch && shiftMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}

export function getShortcutLabel(shortcut: ShortcutAction): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push("⌘");
  if (shortcut.alt) parts.push("⌥");
  if (shortcut.shift) parts.push("⇧");
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(" ");
}

export type { ShortcutAction };
export { defaultShortcuts };
