/**
 * @fileoverview Chart utility functions and color mappings for TAC Cargo analytics
 * @module lib/chartUtils
 */

export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  cyan: {
    bg: "bg-[oklch(0.68_0.20_195)]",
    stroke: "stroke-[oklch(0.68_0.20_195)]",
    fill: "fill-[oklch(0.68_0.20_195)]",
    text: "text-[oklch(0.68_0.20_195)]",
  },
  emerald: {
    bg: "bg-[oklch(0.72_0.18_152)]",
    stroke: "stroke-[oklch(0.72_0.18_152)]",
    fill: "fill-[oklch(0.72_0.18_152)]",
    text: "text-[oklch(0.72_0.18_152)]",
  },
  amber: {
    bg: "bg-[oklch(0.78_0.16_85)]",
    stroke: "stroke-[oklch(0.78_0.16_85)]",
    fill: "fill-[oklch(0.78_0.16_85)]",
    text: "text-[oklch(0.78_0.16_85)]",
  },
  blue: {
    bg: "bg-[oklch(0.62_0.26_240)]",
    stroke: "stroke-[oklch(0.62_0.26_240)]",
    fill: "fill-[oklch(0.62_0.26_240)]",
    text: "text-[oklch(0.62_0.26_240)]",
  },
  magenta: {
    bg: "bg-[oklch(0.70_0.20_320)]",
    stroke: "stroke-[oklch(0.70_0.20_320)]",
    fill: "fill-[oklch(0.70_0.20_320)]",
    text: "text-[oklch(0.70_0.20_320)]",
  },
  coral: {
    bg: "bg-[oklch(0.66_0.22_25)]",
    stroke: "stroke-[oklch(0.66_0.22_25)]",
    fill: "fill-[oklch(0.66_0.22_25)]",
    text: "text-[oklch(0.66_0.22_25)]",
  },
  gray: {
    bg: "bg-muted",
    stroke: "stroke-muted",
    fill: "fill-muted",
    text: "text-muted-foreground",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>;

/**
 * Constructs a mapping of categories to colors for chart legends.
 */
export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(
      category,
      colors.length > 0 ? colors[index % colors.length] : "gray",
    );
  });
  return categoryColors;
};

/**
 * Gets the appropriate Tailwind class for a chart color and utility type.
 */
export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-muted",
    stroke: "stroke-muted",
    fill: "fill-muted",
    text: "text-muted-foreground",
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

/**
 * Gets the Y-axis domain for charts with optional auto-scaling.
 */
export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
): [number | "auto", number | "auto"] => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0);
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

/**
 * Checks if all values for a specific key in an array are the same.
 */
export function hasOnlyOneValueForKey(
  array: Record<string, unknown>[],
  keyToCheck: string,
): boolean {
  if (!array || array.length === 0) return false;

  const values = new Set<unknown>();

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      values.add(obj[keyToCheck]);
    }
  }

  return values.size === 1;
}

/**
 * Cargo-specific status colors for shipment tracking.
 */
export const cargoStatusColors = {
  delivered: "emerald",
  "in-transit": "amber",
  delayed: "coral",
  pending: "blue",
  processing: "cyan",
} as const;

/**
 * Gets the chart color for a cargo status.
 */
export function getCargoStatusColor(
  status: keyof typeof cargoStatusColors,
): AvailableChartColorsKeys {
  return cargoStatusColors[status] as AvailableChartColorsKeys;
}

/**
 * Formats large numbers for chart display.
 */
export function formatChartValue(value: number, prefix: string = ""): string {
  if (value >= 1000000) {
    return `${prefix}${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${prefix}${(value / 1000).toFixed(1)}K`;
  }
  return `${prefix}${value.toLocaleString()}`;
}

/**
 * Formats currency values for Indian Rupees.
 */
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
