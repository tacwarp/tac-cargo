/**
 * @fileoverview Next.js configuration with security headers
 * @module next.config
 */

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Security headers for production deployment
 * Following OWASP recommendations
 */
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  /**
   * React strict mode for development
   */
  reactStrictMode: true,

  /**
   * Allowed dev origins for cross-origin requests
   * Prevents warning about proxy requests in development
   */
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000"],

  /**
   * Powered by header removal for security
   */
  poweredByHeader: false,

  /**
   * Security headers configuration
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // API routes - add CORS and cache headers
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_SITE_URL || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        // Local images - enable long-term immutable caching
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Static assets - enable caching
        source: "/lottie/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /**
   * Image optimization configuration
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shadcnstudio.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Redirect configuration
   */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /**
   * Experimental features for performance optimization
   */
  experimental: {
    // Enable optimized package imports for faster dev server
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@remixicon/react",
      "framer-motion",
      "@radix-ui/react-icons",
    ],
  },

  /**
   * Turbopack configuration (for next dev --turbo)
   */
  turbopack: {
    // Resolve aliases for faster module resolution
    resolveAlias: {
      "@": "./",
    },
  },

  /**
   * Logging configuration
   */
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

/**
 * Sentry configuration options
 */
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Webpack-specific options (moved from deprecated top-level options)
  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,
  },
};

// Export the config wrapped with Sentry
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
