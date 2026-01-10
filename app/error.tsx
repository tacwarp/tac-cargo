"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive h-10 w-10" />
      </div>
      
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground text-sm">
          We encountered an unexpected error while processing your request. 
          Our team has been notified.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="border-destructive/20 bg-destructive/5 mt-8 w-full max-w-lg rounded-lg border p-4 text-left">
          <p className="text-destructive mb-2 font-mono text-xs font-medium">
            Error Details (Dev Only):
          </p>
          <pre className="text-muted-foreground max-h-40 overflow-auto font-mono text-xs whitespace-pre-wrap">
            {error.message}
          </pre>
          {error.digest && (
            <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
