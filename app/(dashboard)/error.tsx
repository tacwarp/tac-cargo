'use client'

/**
 * @fileoverview Dashboard error boundary
 * @module app/(dashboard)/error
 * 
 * Handles errors in the dashboard route group.
 * Automatically used by Next.js when an error occurs.
 */

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Dashboard error component props
 */
interface DashboardErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string }
  /** Function to attempt recovery by re-rendering */
  reset: () => void
}

/**
 * Dashboard error boundary component.
 * 
 * Displays a user-friendly error message when something goes wrong
 * in the dashboard routes.
 * 
 * @param {DashboardErrorProps} props - Component props
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log error to console (or error reporting service)
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-8">
      {/* Error icon */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-destructive/50" />
      </div>

      {/* Error message */}
      <div className="max-w-md text-center">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Dashboard Error
        </h2>
        <p className="text-sm text-muted-foreground">
          We encountered an unexpected error while loading the dashboard. 
          This has been logged and our team will investigate.
        </p>
      </div>

      {/* Error details (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full max-w-lg rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="mb-2 font-mono text-xs font-medium text-destructive">
            Error Details:
          </p>
          <pre className="overflow-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">
            {error.message}
          </pre>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Dashboard Home
          </Link>
        </Button>
      </div>

      {/* Support link */}
      <p className="text-xs text-muted-foreground">
        If this problem persists, please{' '}
        <a 
          href="mailto:support@taccargo.com" 
          className="text-primary underline-offset-4 hover:underline"
        >
          contact support
        </a>
      </p>
    </div>
  )
}
