"use client";

/**
 * @fileoverview React Error Boundary component
 * @module components/error-boundary
 *
 * Catches JavaScript errors in child components and displays
 * a fallback UI instead of crashing the entire application.
 */

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Optional fallback component */
  fallback?: ReactNode;
  /** Optional error handler callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * React Error Boundary component.
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Log error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Reset error state to retry rendering
   */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
          <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-8 w-8" />
          </div>

          <div className="text-center">
            <h2 className="text-foreground mb-2 text-xl font-semibold">
              Something went wrong
            </h2>
            <p className="text-muted-foreground max-w-md text-sm">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="w-full max-w-lg">
              <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
                Error details
              </summary>
              <pre className="bg-muted mt-2 overflow-auto rounded-lg p-4 text-xs">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <Button
            onClick={this.handleReset}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap a component with ErrorBoundary.
 *
 * @param {React.ComponentType<P>} WrappedComponent - Component to wrap
 * @param {Omit<ErrorBoundaryProps, 'children'>} errorBoundaryProps - Error boundary props
 * @returns {React.ComponentType<P>} Wrapped component
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent)
 * ```
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
