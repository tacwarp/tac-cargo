/**
 * @fileoverview Structured logging system with PII sanitization
 * @module lib/logger
 *
 * Production-grade logging that prevents sensitive data exposure.
 * Replaces console.log/error throughout the application.
 *
 * @security
 * - Sanitizes PII before logging
 * - Redacts sensitive fields (tokens, passwords, keys)
 * - Supports different log levels
 * - Structured JSON output for log aggregation
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

/**
 * Sensitive field patterns to redact from logs
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /^api[_-]?key$/i,
  /^private[_-]?key$/i,
  /^secret[_-]?key$/i,
  /^auth[_-]?key$/i,
  /^encryption[_-]?key$/i,
  /authorization/i,
  /cookie/i,
  /session/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /bearer/i,
  /credential/i,
  /auth[_-]?token/i,
];

/**
 * PII field patterns to redact from logs
 */
const PII_PATTERNS = [
  /email/i,
  /phone/i,
  /mobile/i,
  /address/i,
  /ssn/i,
  /passport/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
  /pan/i,
  /aadhaar/i,
  /gst/i,
];

/**
 * Checks if a field name matches sensitive patterns
 */
function isSensitiveField(fieldName: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(fieldName));
}

/**
 * Checks if a field name contains PII
 */
function isPIIField(fieldName: string): boolean {
  return PII_PATTERNS.some((pattern) => pattern.test(fieldName));
}

/**
 * Sanitizes an object by redacting sensitive fields
 *
 * @param {unknown} obj - Object to sanitize
 * @param {Set<unknown>} seen - Set of already visited objects (for circular reference detection)
 * @returns {unknown} Sanitized object
 */
function sanitize(obj: unknown, seen: Set<unknown> = new Set()): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  // Circular reference protection
  if (seen.has(obj)) {
    return "[CIRCULAR_REFERENCE]";
  }

  // Add current object to seen set
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, seen));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (isSensitiveField(key)) {
      sanitized[key] = "[REDACTED]";
    } else if (isPIIField(key)) {
      sanitized[key] = "[PII_REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitize(value, seen);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Formats log message with timestamp and context
 */
function formatLog(
  level: LogLevel,
  message: string,
  context?: LogContext,
): string {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context
    ? (sanitize(context) as Record<string, unknown>)
    : {};

  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(Object.keys(sanitizedContext).length > 0
      ? { context: sanitizedContext }
      : {}),
    environment: process.env.NODE_ENV || "development",
  };

  return JSON.stringify(logEntry);
}

/**
 * Determines if a log level should be output based on environment
 */
function shouldLog(level: LogLevel): boolean {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  if (isDevelopment) {
    return true; // Log everything in development
  }

  if (isProduction) {
    // In production, only log info, warn, and error
    return level !== "debug";
  }

  return true;
}

/**
 * Logger class with structured logging methods
 */
class Logger {
  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (shouldLog("debug")) {
      console.log(formatLog("debug", message, context));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    if (shouldLog("info")) {
      console.log(formatLog("info", message, context));
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    if (shouldLog("warn")) {
      console.warn(formatLog("warn", message, context));
    }
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (shouldLog("error")) {
      const errorContext = {
        ...context,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack:
                  process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
              }
            : String(error),
      };

      console.error(formatLog("error", message, errorContext));
    }
  }

  /**
   * Sanitizes data for safe logging
   */
  sanitize(data: unknown): unknown {
    return sanitize(data);
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Type exports
 */
export type { LogLevel, LogContext };
