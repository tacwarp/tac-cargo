'use client'

/**
 * @fileoverview Global error boundary for the root layout
 * @module app/global-error
 * 
 * Catches errors that occur in the root layout or above.
 * Must include its own html and body tags.
 */

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Global error component props
 */
interface GlobalErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string }
  /** Function to attempt recovery by re-rendering */
  reset: () => void
}

/**
 * Global error boundary component.
 * 
 * This component catches errors that occur in the root layout
 * and provides a fallback UI for the entire application.
 * 
 * @param {GlobalErrorProps} props - Component props
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to console (or error reporting service)
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
          {/* Error icon */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>

          {/* Error message */}
          <div className="max-w-md text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              Critical Error
            </h1>
            <p className="text-zinc-400">
              A critical error occurred and the application couldn&apos;t recover. 
              Please try refreshing the page.
            </p>
          </div>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="w-full max-w-lg rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="mb-2 font-mono text-xs font-medium text-red-400">
                Error Details:
              </p>
              <pre className="overflow-auto whitespace-pre-wrap font-mono text-xs text-zinc-400">
                {error.message}
              </pre>
              {error.digest && (
                <p className="mt-2 font-mono text-xs text-zinc-500">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          {/* Support info */}
          <p className="text-sm text-zinc-500">
            If this problem persists, please contact{' '}
            <a 
              href="mailto:support@taccargo.com" 
              className="text-zinc-300 underline-offset-4 hover:underline"
            >
              support@taccargo.com
            </a>
          </p>
        </div>
      </body>
    </html>
  )
}
