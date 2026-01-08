/**
 * Lazy-loaded components for code splitting and performance
 */

import dynamic from "next/dynamic";

/**
 * Dashboard components (heavy charts)
 */
export const StatusChart = dynamic(
  () =>
    import("@/components/dashboard/status-chart").then((mod) => ({
      default: mod.StatusChart,
    })),
  {
    loading: () => {
      const LoadingSkeleton = () => (
        <div className="bg-muted h-[300px] animate-pulse rounded" />
      );
      return <LoadingSkeleton />;
    },
  },
);

export const TrendChart = dynamic(
  () =>
    import("@/components/dashboard/trend-chart").then((mod) => ({
      default: mod.TrendChart,
    })),
  {
    loading: () => {
      const LoadingSkeleton = () => (
        <div className="bg-muted h-[300px] animate-pulse rounded" />
      );
      return <LoadingSkeleton />;
    },
  },
);

/**
 * Shipments components
 */
export const ShipmentsTable = dynamic(
  () =>
    import("@/components/shipments/shipments-table").then((mod) => ({
      default: mod.ShipmentsTable,
    })),
  {
    loading: () => {
      const LoadingSkeleton = () => (
        <div className="bg-muted h-96 animate-pulse rounded" />
      );
      return <LoadingSkeleton />;
    },
  },
);

export const CreateShipmentForm = dynamic(
  () =>
    import("@/components/shipments/create-shipment-form").then((mod) => ({
      default: mod.CreateShipmentForm,
    })),
  { ssr: false },
);
