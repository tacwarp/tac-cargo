import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Send default PII for better error context in development
  sendDefaultPii: process.env.NODE_ENV === 'development',

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || `tac-cargo@${process.env.npm_package_version || 'dev'}`,

  // Ignore specific errors that are not actionable
  ignoreErrors: [
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
  ],
});
