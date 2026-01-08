import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Add breadcrumb
    Sentry.addBreadcrumb({
      category: "api",
      message: "Server error endpoint called",
      level: "info",
    });

    // Simulate some processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Throw error
    throw new Error("Test Server-Side Error from TAC Cargo API");
  } catch (error) {
    // Capture exception with context
    Sentry.captureException(error, {
      tags: {
        test_type: "server",
        endpoint: "/api/test-sentry/server-error",
      },
      extra: {
        timestamp: new Date().toISOString(),
        method: "GET",
      },
    });

    return NextResponse.json(
      {
        error: "Server error captured",
        message: "Error has been sent to Sentry. Check your dashboard.",
      },
      { status: 500 },
    );
  }
}
