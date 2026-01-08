/**
 * @deprecated Use components/charts/bar-chart-multiple instead
 * This file is maintained for backward compatibility
 */
"use client";

import { ChartBarMultiple as UnifiedChartBarMultiple } from "@/components/charts/bar-chart-multiple";

export const description = "A multiple bar chart";

export function ChartBarMultiple() {
  return <UnifiedChartBarMultiple variant="dashboard" />;
}
