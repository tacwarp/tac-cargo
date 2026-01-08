"use client";

/**
 * Dynamic imports for heavy components to reduce initial bundle size
 * Use these instead of direct imports for components that are:
 * - Not needed on initial page load
 * - Heavy (charts, animations, complex widgets)
 * - Used in specific routes only
 */

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "@/components/dashboard/skeletons";

/**
 * Chart loading placeholder
 */
function ChartLoadingFallback() {
  return <ChartSkeleton />;
}

/**
 * Generic loading placeholder
 */
function GenericLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

/**
 * Lottie animation - lazy loaded (reduces ~50KB from initial bundle)
 */
export const DynamicLottie = dynamic(
  () =>
    import("@/components/ui/lottie-container").then(
      (mod) => mod.LottieContainer,
    ),
  {
    loading: GenericLoadingFallback,
    ssr: false, // Lottie doesn't work on server
  },
);

/**
 * QR Code component - lazy loaded
 */
export const DynamicQRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  {
    loading: () => <Skeleton className="h-24 w-24" />,
    ssr: false,
  },
);

/**
 * Barcode scanner - lazy loaded (camera access)
 */
export const DynamicBarcodeScanner = dynamic(
  () =>
    import("@/components/dashboard/barcode-scanner").then(
      (mod) => mod.BarcodeScanner,
    ),
  {
    loading: GenericLoadingFallback,
    ssr: false,
  },
);

/**
 * Recharts components - lazy loaded for dashboard pages
 * These are heavy and only needed on specific pages
 */
export const DynamicAreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  },
);

export const DynamicBarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  },
);

export const DynamicLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  },
);

export const DynamicPieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  },
);

/**
 * PDF viewer - lazy loaded (very heavy)
 */
export const DynamicPDFViewer = dynamic(
  () =>
    import("@/components/dashboard/pdf-viewer")
      .then((mod) => mod.PDFViewer)
      .catch(() => () => null),
  {
    loading: GenericLoadingFallback,
    ssr: false,
  },
);

/**
 * Chat widget - lazy loaded (not critical for initial load)
 */
export const DynamicChatWidget = dynamic(
  () =>
    import("@/components/landing/chat-widget").then((mod) => mod.ChatWidget),
  {
    loading: () => null, // No loading state for floating widget
    ssr: false,
  },
);
