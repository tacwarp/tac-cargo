import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // PII Configuration - Set to false for GDPR/CCPA compliance
  // When true: Collects IP addresses, user agents, and cookies
  // When false: No automatic PII collection (recommended for production)
  // Review privacy policy implications before enabling in production
  sendDefaultPii: process.env.NODE_ENV === 'development',

  // Replay configuration for session replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Facebook borked
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
    // reduce this. (thanks @acdha)
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
  ],

  // Ignore specific URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
  ],
});
