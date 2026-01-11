"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestSentryPage() {
  const handleClientError = () => {
    try {
      throw new Error("Test Client-Side Error from TAC Cargo");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: "client",
          component: "test-sentry-page",
        },
        extra: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      });
      alert("Client error captured! Check Sentry dashboard.");
    }
  };

  const handleUncaughtError = () => {
    // This will be caught by Sentry automatically
    throw new Error("Uncaught Client-Side Error from TAC Cargo");
  };

  const handleServerError = async () => {
    try {
      const response = await fetch("/api/test-sentry/server-error");
      if (!response.ok) {
        alert(`Server error (${response.status}): Check Sentry dashboard.`);
        return;
      }
      const data = await response.json();
      alert(data.message || "Server error triggered!");
    } catch {
      alert("Server error captured! Check Sentry dashboard.");
    }
  };

  const handlePerformanceTest = async () => {
    // Use startSpan instead of startTransaction (new API in Sentry v8+)
    await Sentry.startSpan(
      {
        name: "Test Performance Transaction",
        op: "test.performance",
      },
      async () => {
        try {
          // Simulate some work
          await Sentry.startSpan(
            { name: "Simulated Task 1", op: "task" },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 500));
            },
          );

          await Sentry.startSpan(
            { name: "Simulated Task 2", op: "task" },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 300));
            },
          );

          alert(
            "Performance transaction captured! Check Sentry Performance dashboard.",
          );
        } catch (error) {
          throw error;
        }
      },
    );
  };

  const handleBreadcrumbTest = () => {
    Sentry.addBreadcrumb({
      category: "test",
      message: "User clicked breadcrumb test button",
      level: "info",
      data: {
        timestamp: new Date().toISOString(),
        page: "test-sentry",
      },
    });

    Sentry.addBreadcrumb({
      category: "navigation",
      message: "User navigated to test page",
      level: "info",
    });

    Sentry.addBreadcrumb({
      category: "action",
      message: "User performed test action",
      level: "warning",
    });

    // Now trigger an error to see breadcrumbs
    try {
      throw new Error("Error with Breadcrumbs");
    } catch (error) {
      Sentry.captureException(error);
      alert("Error with breadcrumbs captured! Check Sentry issue details.");
    }
  };

  const handleUserContextTest = () => {
    // Only set PII in development to prevent data leaks in production
    if (process.env.NODE_ENV === "development") {
      Sentry.setUser({
        id: "test-user-123",
        email: "test@taccargo.com",
        username: "Test User",
        ip_address: "{{auto}}",
      });
    } else {
      // In production, only set non-PII identifiers
      Sentry.setUser({
        id: "anonymous-test-user",
      });
    }

    Sentry.setTag("environment", process.env.NODE_ENV || "test");
    Sentry.setTag("feature", "sentry-testing");

    try {
      throw new Error("Error with User Context");
    } catch (error) {
      Sentry.captureException(error);
      alert("Error with user context captured! Check Sentry issue details.");
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sentry Integration Test</h1>
        <p className="text-muted-foreground">
          Test various Sentry features and error tracking capabilities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Errors</CardTitle>
            <CardDescription>
              Test error tracking in the browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleClientError}
              variant="destructive"
              className="w-full"
            >
              Trigger Caught Client Error
            </Button>
            <Button
              onClick={handleUncaughtError}
              variant="destructive"
              className="w-full"
            >
              Trigger Uncaught Client Error
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Errors</CardTitle>
            <CardDescription>Test error tracking in API routes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleServerError}
              variant="destructive"
              className="w-full"
            >
              Trigger Server Error
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Monitoring</CardTitle>
            <CardDescription>
              Test transaction and span tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handlePerformanceTest}
              variant="secondary"
              className="w-full"
            >
              Test Performance Transaction
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breadcrumbs</CardTitle>
            <CardDescription>
              Test breadcrumb tracking for context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleBreadcrumbTest}
              variant="secondary"
              className="w-full"
            >
              Test Breadcrumbs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Context</CardTitle>
            <CardDescription>
              Test user identification and tagging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleUserContextTest}
              variant="secondary"
              className="w-full"
            >
              Test User Context
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>How to verify Sentry integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-inside list-decimal space-y-2">
              <li>Click any test button above</li>
              <li>Wait 1-2 minutes for events to appear</li>
              <li>Visit your Sentry dashboard</li>
              <li>Check Issues, Performance, or Session Replay</li>
              <li>Verify error details and context</li>
            </ol>
            <div className="bg-muted mt-4 rounded-lg p-4">
              <p className="font-semibold">Sentry Dashboard:</p>
              <p className="text-muted-foreground text-xs break-all">
                https://sentry.io/organizations/your-org/issues/
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
