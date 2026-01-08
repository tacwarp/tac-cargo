import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test route not permitted in production" },
      { status: 403 },
    );
  }
  const startTime = Date.now();

  return await Sentry.startSpan(
    {
      name: "Test API Performance",
      op: "http.server",
    },
    async () => {
      try {
        // Simulate database query
        await Sentry.startSpan(
          { name: "Simulated database query", op: "db.query" },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
          },
        );

        // Simulate external API call
        await Sentry.startSpan(
          { name: "Simulated external API call", op: "http.client" },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
          },
        );

        // Simulate data processing
        await Sentry.startSpan(
          { name: "Simulated data processing", op: "task" },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 150));
          },
        );

        const duration = Date.now() - startTime;

        return NextResponse.json({
          success: true,
          message: "Performance transaction captured",
          durationMs: duration,
        });
      } catch (error) {
        Sentry.captureException(error);

        return NextResponse.json(
          { error: "Performance test failed" },
          { status: 500 },
        );
      }
    },
  );
}
