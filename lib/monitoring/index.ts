import * as Sentry from '@sentry/nextjs'

export interface MetricData {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: Date
}

export interface PerformanceMetric {
  operation: string
  duration: number
  success: boolean
  metadata?: Record<string, unknown>
}

export function trackMetric(metric: MetricData): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Metric]', metric.name, metric.value, metric.tags)
    return
  }

  // Send to Sentry as breadcrumb
  Sentry.addBreadcrumb({
    category: 'metric',
    message: metric.name,
    data: { value: metric.value, ...metric.tags },
    level: 'info',
  })
}

export function trackPerformance(metric: PerformanceMetric): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', metric.operation, `${metric.duration}ms`, metric.success)
    return
  }

  Sentry.addBreadcrumb({
    category: 'performance',
    message: metric.operation,
    data: { duration: metric.duration, success: metric.success, ...metric.metadata },
    level: metric.success ? 'info' : 'warning',
  })
}

export function trackError(error: Error, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', error.message, context)
    return
  }

  Sentry.captureException(error, {
    extra: context,
  })
}

export function trackEvent(name: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Event]', name, data)
    return
  }

  Sentry.captureMessage(name, {
    level: 'info',
    extra: data,
  })
}

export function setUserContext(userId: string, email?: string, organizationId?: string): void {
  Sentry.setUser({
    id: userId,
    email,
  })

  if (organizationId) {
    Sentry.setTag('organization_id', organizationId)
  }
}

export function clearUserContext(): void {
  Sentry.setUser(null)
}

export function withPerformanceTracking<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()

  return fn()
    .then(result => {
      trackPerformance({
        operation,
        duration: Date.now() - startTime,
        success: true,
      })
      return result
    })
    .catch(error => {
      trackPerformance({
        operation,
        duration: Date.now() - startTime,
        success: false,
        metadata: { error: error.message },
      })
      throw error
    })
}

export class HealthChecker {
  private checks: Map<string, () => Promise<boolean>> = new Map()

  register(name: string, check: () => Promise<boolean>): void {
    this.checks.set(name, check)
  }

  async runAll(): Promise<Record<string, { status: 'ok' | 'error'; latency: number }>> {
    const results: Record<string, { status: 'ok' | 'error'; latency: number }> = {}

    await Promise.all(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        const start = Date.now()
        try {
          const ok = await check()
          results[name] = {
            status: ok ? 'ok' : 'error',
            latency: Date.now() - start,
          }
        } catch {
          results[name] = {
            status: 'error',
            latency: Date.now() - start,
          }
        }
      })
    )

    return results
  }
}

export const healthChecker = new HealthChecker()
