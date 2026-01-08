/**
 * @deprecated Use components/charts/pie-chart-donut-text instead
 * This file is maintained for backward compatibility
 */
"use client";

import { ChartPieDonutText as UnifiedChartPieDonutText } from "@/components/charts/pie-chart-donut-text";

export const description = "A donut chart with text";

export function ChartPieDonutText() {
  return <UnifiedChartPieDonutText variant="dashboard" />;
}
