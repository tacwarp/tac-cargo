/**
 * @fileoverview Environment variable validation
 * @module lib/env-validation
 *
 * Validates required environment variables at build time.
 * Prevents deployment with missing or invalid configuration.
 *
 * @security
 * - Fails fast on missing critical variables
 * - Validates URL formats
 * - Prevents wildcard CORS in production
 */

import { logger } from "./logger";

/**
 * Required environment variables for all environments
 */
const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

/**
 * Required environment variables for production only
 */
const PRODUCTION_REQUIRED_VARS = ["NEXT_PUBLIC_SITE_URL"] as const;

/**
 * Environment variable validation result
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates Supabase URL format
 */
function isValidSupabaseUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;

  // Supabase URLs should contain 'supabase' in the hostname
  // and not be placeholder values
  const parsed = new URL(url);
  return (
    parsed.hostname.includes("supabase") &&
    !parsed.hostname.includes("placeholder") &&
    !parsed.hostname.includes("example")
  );
}

/**
 * Validates that a value is not a placeholder
 * Uses more specific patterns to avoid false positives
 */
function isNotPlaceholder(value: string): boolean {
  const placeholderPatterns = [
    /^placeholder$/i,
    /^your[-_]?[\w]+[-_]?here$/i,
    /^example[-_]?[\w]*$/i,
    /^dummy[-_]?[\w]*$/i,
    /^fake[-_]?[\w]*$/i,
    /^xxx+$/i,
    /^change[-_]?me$/i,
    /^todo$/i,
    /^replace[-_]?this$/i,
  ];

  return !placeholderPatterns.some((pattern) => pattern.test(value));
}

/**
 * Validates all environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === "production";

  // Check required variables for all environments
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName];

    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
      continue;
    }

    // Validate Supabase URL
    if (varName === "NEXT_PUBLIC_SUPABASE_URL") {
      if (!isValidSupabaseUrl(value)) {
        errors.push(
          `Invalid Supabase URL: ${varName}. Must be a valid Supabase project URL.`,
        );
      }
    }

    // Validate Supabase anon key
    if (varName === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
      if (!isNotPlaceholder(value)) {
        errors.push(
          `Invalid Supabase anon key: ${varName}. Appears to be a placeholder value.`,
        );
      }
      if (value.length < 100) {
        warnings.push(
          `Supabase anon key seems too short. Expected JWT format.`,
        );
      }
    }
  }

  // Check production-specific variables
  if (isProduction) {
    for (const varName of PRODUCTION_REQUIRED_VARS) {
      const value = process.env[varName];

      if (!value) {
        errors.push(
          `Missing required production environment variable: ${varName}`,
        );
        continue;
      }

      // Validate site URL
      if (varName === "NEXT_PUBLIC_SITE_URL") {
        if (!isValidUrl(value)) {
          errors.push(
            `Invalid site URL: ${varName}. Must be a valid HTTP/HTTPS URL.`,
          );
        }
        if (value === "*") {
          errors.push(
            `SECURITY RISK: ${varName} cannot be wildcard (*) in production. This allows CORS from any origin.`,
          );
        }
        if (value.includes("localhost") || value.includes("127.0.0.1")) {
          warnings.push(
            `${varName} contains localhost. This may be incorrect for production.`,
          );
        }
      }
    }
  }

  // Additional security checks
  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    errors.push(
      "SECURITY RISK: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY should NOT be prefixed with NEXT_PUBLIC_. " +
        "This exposes the service role key to the client. Use SUPABASE_SERVICE_ROLE_KEY instead.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates environment and logs results
 * Throws error if validation fails in production
 */
export function validateAndLog(): void {
  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    result.warnings.forEach((warning) => {
      logger.warn("Environment validation warning", { warning });
    });
  }

  if (!result.valid) {
    result.errors.forEach((error) => {
      logger.error("Environment validation error", new Error(error));
    });

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Environment validation failed. Cannot start application in production with invalid configuration.\n" +
          result.errors.join("\n"),
      );
    } else {
      logger.warn(
        "Environment validation failed in development. Application may not function correctly.",
        { errors: result.errors },
      );
    }
  } else {
    logger.info("Environment validation passed", {
      environment: process.env.NODE_ENV,
      varsChecked:
        REQUIRED_VARS.length +
        (process.env.NODE_ENV === "production"
          ? PRODUCTION_REQUIRED_VARS.length
          : 0),
    });
  }
}

/**
 * Gets environment variable with validation
 * Throws error if variable is missing or invalid
 */
export function getRequiredEnv(varName: string): string {
  const value = process.env[varName];

  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }

  if (!isNotPlaceholder(value)) {
    throw new Error(
      `Environment variable ${varName} appears to be a placeholder value`,
    );
  }

  return value;
}

/**
 * Gets optional environment variable with default
 */
export function getOptionalEnv(varName: string, defaultValue: string): string {
  return process.env[varName] || defaultValue;
}
