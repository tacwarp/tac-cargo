"use client";

/**
 * @fileoverview Global error boundary for the root layout
 * @module app/global-error
 *
 * Catches errors that occur in the root layout or above.
 * Must include its own html and body tags.
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Global error component props
 */
interface GlobalErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to attempt recovery by re-rendering */
  reset: () => void;
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
    // Log error to console and Sentry (if configured)
    console.error("[Global Error]", error);

    // Sentry integration - captures critical error
    if (
      typeof globalThis !== "undefined" &&
      (
        globalThis as unknown as {
          Sentry?: { captureException: (e: Error, opts?: object) => void };
        }
      ).Sentry
    ) {
      (
        globalThis as unknown as {
          Sentry: { captureException: (e: Error, opts?: object) => void };
        }
      ).Sentry.captureException(error, {
        level: "fatal",
        tags: { errorBoundary: "global" },
      });
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
          {/* Error icon */}
          <div className="bg-destructive/10 flex h-24 w-24 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-12 w-12" />
          </div>

          {/* Error message */}
          <div className="max-w-md text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              Critical Error
            </h1>
            <p className="text-muted-foreground">
              A critical error occurred and the application couldn&apos;t
              recover. Please try refreshing the page.
            </p>
          </div>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="border-destructive/20 bg-destructive/5 w-full max-w-lg rounded-lg border p-4">
              <p className="text-destructive mb-2 font-mono text-xs font-medium">
                Error Details:
              </p>
              <pre className="text-muted-foreground overflow-auto font-mono text-xs whitespace-pre-wrap">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          {/* Support info */}
          <p className="text-muted-foreground text-sm">
            If this problem persists, please contact{" "}
            <a
              href="mailto:support@taccargo.com"
              className="text-foreground underline-offset-4 hover:underline"
            >
              support@taccargo.com
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
