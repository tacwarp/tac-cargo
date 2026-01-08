/**
 * @fileoverview Global 404 Not Found page
 * @module app/not-found
 *
 * Displays when a user navigates to a route that doesn't exist.
 */

import Link from "next/link";
import { Package, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Not Found page component.
 *
 * Renders a user-friendly 404 page with navigation options.
 */
export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] bg-[size:40px_40px]" />

      {/* Header */}
      <header className="border-border/40 flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="border-border bg-muted/20 group-hover:border-primary/50 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border transition-colors">
            <Package className="text-foreground h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-foreground text-sm font-semibold tracking-tight">
              TAC
            </span>
            <span className="text-muted-foreground mt-[2px] font-mono text-[9px] tracking-widest uppercase">
              Infrastructure
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-lg text-center">
          {/* Error Code */}
          <div className="mb-8">
            <span className="text-foreground/10 font-mono text-8xl font-bold tracking-tighter">
              404
            </span>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-3">
            <span className="text-muted-foreground block font-mono text-[10px] tracking-widest uppercase">
              Route Not Found
            </span>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Page doesn&apos;t exist
            </h1>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              The page you&apos;re looking for has been moved, deleted, or never
              existed. Check the URL or navigate back to safety.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="w-full gap-2 sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 sm:w-auto"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Tracking Input */}
          <div className="border-border mt-12 border-t pt-8">
            <p className="text-muted-foreground mb-4 text-xs">
              Looking to track a shipment?
            </p>
            <Button asChild variant="ghost" className="gap-2 text-sm">
              <Link href="/#tracking">
                <Search className="h-4 w-4" />
                Track Shipment
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/40 border-t px-6 py-4">
        <p className="text-muted-foreground text-center font-mono text-[10px] tracking-widest uppercase">
          TAC Cargo Infrastructure © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
