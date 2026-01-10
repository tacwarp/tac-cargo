#!/usr/bin/env tsx
/**
 * Sentry Configuration Check Script
 * Run with: npx tsx scripts/sentry-check.ts
 * 
 * Used in CI/CD to verify Sentry is properly configured before deployment
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
}

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check 1: DSN is configured
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  results.push({
    name: "Sentry DSN",
    passed: !!dsn && dsn.startsWith("https://"),
    message: dsn
      ? `DSN configured: ${dsn.substring(0, 30)}...`
      : "NEXT_PUBLIC_SENTRY_DSN is not set",
    severity: dsn ? "info" : "error",
  });

  // Check 2: Sentry org is configured
  const org = process.env.SENTRY_ORG;
  results.push({
    name: "Sentry Organization",
    passed: !!org,
    message: org ? `Organization: ${org}` : "SENTRY_ORG is not set",
    severity: org ? "info" : "warning",
  });

  // Check 3: Sentry project is configured
  const project = process.env.SENTRY_PROJECT;
  results.push({
    name: "Sentry Project",
    passed: !!project,
    message: project ? `Project: ${project}` : "SENTRY_PROJECT is not set",
    severity: project ? "info" : "warning",
  });

  // Check 4: Auth token for source maps
  const authToken = process.env.SENTRY_AUTH_TOKEN;
  results.push({
    name: "Sentry Auth Token",
    passed: !!authToken,
    message: authToken
      ? "Auth token configured (for source map uploads)"
      : "SENTRY_AUTH_TOKEN is not set - source maps won't upload",
    severity: authToken ? "info" : "warning",
  });

  // Check 5: Configuration files exist
  const fs = await import("fs");
  const configFiles = [
    "sentry.client.config.ts",
    "sentry.server.config.ts",
    "sentry.edge.config.ts",
    "instrumentation.ts",
  ];

  for (const file of configFiles) {
    const exists = fs.existsSync(path.resolve(process.cwd(), file));
    results.push({
      name: `Config: ${file}`,
      passed: exists,
      message: exists ? `✓ ${file} exists` : `✗ ${file} is missing`,
      severity: exists ? "info" : "error",
    });
  }

  // Check 6: Test API endpoint for connectivity
  if (dsn) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/sentry/health?action=health",
        { method: "GET", signal: AbortSignal.timeout(5000) }
      );
      const data = await response.json();
      results.push({
        name: "Sentry API Health",
        passed: data.success && data.data?.initialized,
        message: data.success
          ? "Sentry health endpoint responding"
          : "Sentry health check failed",
        severity: data.success ? "info" : "warning",
      });
    } catch {
      results.push({
        name: "Sentry API Health",
        passed: false,
        message: "Could not reach health endpoint (server may not be running)",
        severity: "warning",
      });
    }
  }

  return results;
}

async function main() {
  console.log("\n🔍 Sentry Configuration Check\n");
  console.log("=".repeat(50));

  const results = await runChecks();

  const errors = results.filter((r) => !r.passed && r.severity === "error");
  const warnings = results.filter((r) => !r.passed && r.severity === "warning");
  const passed = results.filter((r) => r.passed);

  // Print results
  for (const result of results) {
    const icon = result.passed ? "✅" : result.severity === "error" ? "❌" : "⚠️";
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}\n`);
  }

  console.log("=".repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Passed: ${passed.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   ❌ Errors: ${errors.length}\n`);

  if (errors.length > 0) {
    console.log("❌ Sentry configuration has errors that must be fixed.\n");
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log("⚠️  Sentry configuration has warnings. Review before production.\n");
    process.exit(0);
  }

  console.log("✅ Sentry configuration is valid.\n");
  process.exit(0);
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
