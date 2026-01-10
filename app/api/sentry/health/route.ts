/**
 * Sentry Health Check API
 * Automated endpoint for CI/CD Sentry verification
 */

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  checkSentryHealth,
  runSentryIntegrationTest,
  validateSentryConfig,
} from "@/lib/sentry/test-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "health";

  return await Sentry.startSpan(
    {
      name: "Sentry Health API",
      op: "http.server",
      attributes: { "sentry.health.action": action },
    },
    async () => {
      try {
        switch (action) {
          case "health": {
            const health = checkSentryHealth();
            return NextResponse.json({
              success: true,
              action: "health",
              data: health,
              timestamp: new Date().toISOString(),
            });
          }

          case "validate": {
            const validation = validateSentryConfig();
            return NextResponse.json({
              success: validation.valid,
              action: "validate",
              data: validation,
              timestamp: new Date().toISOString(),
            });
          }

          case "test": {
            // Only allow in development or with special header
            const isAllowed =
              process.env.NODE_ENV === "development" ||
              request.headers.get("x-sentry-test-key") ===
                process.env.SENTRY_TEST_KEY;

            if (!isAllowed) {
              return NextResponse.json(
                { success: false, error: "Test endpoint not available in production" },
                { status: 403 }
              );
            }

            const results = await runSentryIntegrationTest();
            const allPassed = results.every((r) => r.success);

            return NextResponse.json({
              success: allPassed,
              action: "test",
              data: {
                results,
                summary: {
                  total: results.length,
                  passed: results.filter((r) => r.success).length,
                  failed: results.filter((r) => !r.success).length,
                },
              },
              timestamp: new Date().toISOString(),
            });
          }

          default:
            return NextResponse.json(
              {
                success: false,
                error: `Unknown action: ${action}`,
                availableActions: ["health", "validate", "test"],
              },
              { status: 400 }
            );
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            api_endpoint: "/api/sentry/health",
            action,
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }
  );
}
