import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "error";

  return await Sentry.startSpan(
    { name: "Test Sentry API", op: "http.server" },
    async () => {
      Sentry.addBreadcrumb({
        category: "test",
        message: `Test Sentry API called with action: ${action}`,
        level: "info",
      });

      try {
        switch (action) {
          case "error":
            throw new Error("Test server-side error from API route");

          case "message":
            Sentry.captureMessage("Test server message", {
              level: "info",
              tags: { test: true, source: "api" },
            });
            return NextResponse.json({
              success: true,
              message: "Test message sent to Sentry",
            });

          case "warning":
            Sentry.captureMessage("Test server warning", {
              level: "warning",
              tags: { test: true, source: "api" },
            });
            return NextResponse.json({
              success: true,
              message: "Test warning sent to Sentry",
            });

          case "success":
            return NextResponse.json({
              success: true,
              message: "No error triggered",
              sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? "configured" : "missing",
            });

          default:
            throw new Error(`Unknown action: ${action}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        Sentry.captureException(error, {
          tags: {
            api_endpoint: "/api/test-sentry",
            test: true,
            action,
          },
          extra: {
            url: request.url,
            timestamp: new Date().toISOString(),
          },
        });

        return NextResponse.json(
          { success: false, error: errorMessage },
          { status: 500 }
        );
      }
    }
  );
}
