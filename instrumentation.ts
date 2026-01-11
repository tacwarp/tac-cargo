/**
 * Instrumentation file for Next.js
 * This file is used to initialize Sentry and other monitoring tools
 * It runs once when the server starts
 * 
 * TEMPORARILY DISABLED due to junction point file resolution issues
 */

export async function register() {
  // Temporarily disabled Sentry to resolve disk space issues
  // Re-enable after confirming junction works properly
  
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  //   await import("./sentry.server.config");
  // }

  // if (process.env.NEXT_RUNTIME === "edge") {
  //   await import("./sentry.edge.config");
  // }
  
  console.log("Instrumentation: Sentry temporarily disabled");
}
