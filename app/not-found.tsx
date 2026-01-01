/**
 * @fileoverview Global 404 Not Found page
 * @module app/not-found
 * 
 * Displays when a user navigates to a route that doesn't exist.
 */

import Link from 'next/link'
import { Package, Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Not Found page component.
 * 
 * Renders a user-friendly 404 page with navigation options.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted/20 transition-colors group-hover:border-primary/50">
            <Package className="h-4 w-4 text-foreground transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">TAC</span>
            <span className="mt-[2px] font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Infrastructure</span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-lg text-center">
          {/* Error Code */}
          <div className="mb-8">
            <span className="font-mono text-8xl font-bold tracking-tighter text-foreground/10">
              404
            </span>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-3">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Route Not Found
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Page doesn&apos;t exist
            </h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              The page you&apos;re looking for has been moved, deleted, or never existed. 
              Check the URL or navigate back to safety.
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
            <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Tracking Input */}
          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-4 text-xs text-muted-foreground">
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
      <footer className="border-t border-border/40 px-6 py-4">
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          TAC Cargo Infrastructure © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
