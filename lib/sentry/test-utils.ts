/**
 * Sentry Test Utilities
 * Provides functions for automated Sentry error and issue verification
 */

import * as Sentry from "@sentry/nextjs";

export interface SentryTestResult {
  success: boolean;
  testName: string;
  eventId?: string;
  error?: string;
  timestamp: string;
}

export interface SentryHealthCheck {
  dsn: boolean;
  initialized: boolean;
  environment: string;
  release: string | undefined;
}

/**
 * Check if Sentry is properly configured
 */
export function checkSentryHealth(): SentryHealthCheck {
  const client = Sentry.getClient();
  const options = client?.getOptions();

  return {
    dsn: !!options?.dsn,
    initialized: !!client,
    environment: options?.environment || "unknown",
    release: options?.release,
  };
}

/**
 * Capture a test exception and return the event ID
 */
export function captureTestException(
  message: string,
  tags?: Record<string, string>
): string | undefined {
  const error = new Error(message);
  error.name = "SentryTestError";

  return Sentry.captureException(error, {
    tags: {
      test: "true",
      automated: "true",
      ...tags,
    },
    extra: {
      testTimestamp: new Date().toISOString(),
      testType: "automated",
    },
  });
}

/**
 * Capture a test message and return the event ID
 */
export function captureTestMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  tags?: Record<string, string>
): string | undefined {
  return Sentry.captureMessage(message, {
    level,
    tags: {
      test: "true",
      automated: "true",
      ...tags,
    },
  });
}

/**
 * Run a comprehensive Sentry integration test
 */
export async function runSentryIntegrationTest(): Promise<SentryTestResult[]> {
  const results: SentryTestResult[] = [];
  const timestamp = new Date().toISOString();

  // Test 1: Health check
  const health = checkSentryHealth();
  results.push({
    success: health.dsn && health.initialized,
    testName: "Sentry Health Check",
    timestamp,
    error: !health.dsn
      ? "DSN not configured"
      : !health.initialized
        ? "Sentry not initialized"
        : undefined,
  });

  // Test 2: Capture exception
  try {
    const eventId = captureTestException(
      "Automated test exception - verify Sentry capture",
      { testSuite: "integration" }
    );
    results.push({
      success: !!eventId,
      testName: "Exception Capture",
      eventId,
      timestamp,
    });
  } catch (error) {
    results.push({
      success: false,
      testName: "Exception Capture",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    });
  }

  // Test 3: Capture message
  try {
    const eventId = captureTestMessage(
      "Automated test message - verify Sentry capture",
      "info",
      { testSuite: "integration" }
    );
    results.push({
      success: !!eventId,
      testName: "Message Capture",
      eventId,
      timestamp,
    });
  } catch (error) {
    results.push({
      success: false,
      testName: "Message Capture",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    });
  }

  // Test 4: Breadcrumb
  try {
    Sentry.addBreadcrumb({
      category: "test",
      message: "Automated test breadcrumb",
      level: "info",
      data: { automated: true, timestamp },
    });
    results.push({
      success: true,
      testName: "Breadcrumb Addition",
      timestamp,
    });
  } catch (error) {
    results.push({
      success: false,
      testName: "Breadcrumb Addition",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    });
  }

  // Test 5: Span creation
  try {
    await Sentry.startSpan(
      {
        name: "Automated Test Span",
        op: "test.automated",
        attributes: { "test.automated": true },
      },
      async () => {
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    );
    results.push({
      success: true,
      testName: "Span Creation",
      timestamp,
    });
  } catch (error) {
    results.push({
      success: false,
      testName: "Span Creation",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    });
  }

  // Flush events to ensure they're sent
  await Sentry.flush(2000);

  return results;
}

/**
 * Validate Sentry configuration for production readiness
 */
export function validateSentryConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check DSN
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    errors.push("NEXT_PUBLIC_SENTRY_DSN environment variable is not set");
  }

  // Check org and project for source map uploads
  if (!process.env.SENTRY_ORG) {
    warnings.push("SENTRY_ORG not set - source map uploads will fail");
  }
  if (!process.env.SENTRY_PROJECT) {
    warnings.push("SENTRY_PROJECT not set - source map uploads will fail");
  }
  if (!process.env.SENTRY_AUTH_TOKEN) {
    warnings.push("SENTRY_AUTH_TOKEN not set - source map uploads will fail");
  }

  // Check client initialization
  const client = Sentry.getClient();
  if (!client) {
    errors.push("Sentry client is not initialized");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
