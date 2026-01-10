"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bug, Server, Zap } from "lucide-react";

export default function TestSentryPage() {
  const [status, setStatus] = useState<string>("");

  const triggerClientError = () => {
    setStatus("Triggering client-side error...");
    throw new Error("Test client-side error from Sentry test page");
  };

  const triggerManualCapture = () => {
    setStatus("Capturing manual exception...");
    try {
      throw new Error("Manually captured test error");
    } catch (error) {
      Sentry.captureException(error, {
        tags: { test: true, type: "manual" },
        extra: { timestamp: new Date().toISOString() },
      });
      setStatus("✅ Exception manually captured and sent to Sentry");
    }
  };

  const triggerServerError = async () => {
    setStatus("Triggering server-side error...");
    try {
      const response = await fetch("/api/test-sentry");
      const data = await response.json();
      if (!response.ok) {
        setStatus(`✅ Server error triggered: ${data.error}`);
      } else {
        setStatus(`Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setStatus(`✅ Server error triggered (network error caught)`);
    }
  };

  const sendTestMessage = () => {
    setStatus("Sending test message to Sentry...");
    Sentry.captureMessage("Test message from Sentry test page", {
      level: "info",
      tags: { test: true, type: "message" },
    });
    setStatus("✅ Test message sent to Sentry");
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-6 w-6" />
            Sentry Integration Test
          </CardTitle>
          <CardDescription>
            Use these buttons to test different Sentry error capture scenarios.
            Check your Sentry dashboard to verify errors are being captured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button
              onClick={triggerClientError}
              variant="destructive"
              className="justify-start gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Trigger Client-Side Error (will crash)
            </Button>

            <Button
              onClick={triggerManualCapture}
              variant="outline"
              className="justify-start gap-2"
            >
              <Zap className="h-4 w-4" />
              Capture Manual Exception
            </Button>

            <Button
              onClick={triggerServerError}
              variant="outline"
              className="justify-start gap-2"
            >
              <Server className="h-4 w-4" />
              Trigger Server-Side Error (API)
            </Button>

            <Button
              onClick={sendTestMessage}
              variant="secondary"
              className="justify-start gap-2"
            >
              <Bug className="h-4 w-4" />
              Send Test Message
            </Button>
          </div>

          {status && (
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm font-mono">{status}</p>
            </div>
          )}

          <div className="mt-6 text-sm text-muted-foreground">
            <p className="font-medium">Expected Sentry Behavior:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Client Error:</strong> Caught by error boundary, sent to Sentry</li>
              <li><strong>Manual Capture:</strong> Explicitly sent via Sentry.captureException</li>
              <li><strong>Server Error:</strong> Caught by API route, sent from server</li>
              <li><strong>Test Message:</strong> Info-level message sent via Sentry.captureMessage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
