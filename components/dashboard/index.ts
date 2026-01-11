/**
 * @fileoverview Dashboard Components Index
 * Centralized exports for all dashboard components
 */

// Charts
export { AreaChartGradient } from "@/components/charts/area-chart-gradient";
export { LineChartMultiple } from "@/components/charts/line-chart-multiple";
export { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal";
export { RadialChartProgress } from "@/components/charts/radial-chart-progress";
export { RadarChartPerformance } from "@/components/charts/radar-chart-performance";
export { PieChartInteractive } from "@/components/charts/pie-chart-interactive";

// Core Dashboard Components
export { MetricCardEnhanced } from "./metric-card-enhanced";
export { StatusPipeline, type StatusStage } from "./status-pipeline";
export { TrackingTimeline, type TrackingEvent } from "./tracking-timeline";
export { QuickActions, type QuickAction } from "./quick-actions";
export { LiveActivityFeed, type ActivityEvent } from "./live-activity-feed";
export { IllustratedEmptyState, type EmptyStateType } from "./illustrated-empty-state";

// Advanced Components
export { AnimatedRouteMap } from "./animated-route-map";
export { EnhancedScanner } from "./enhanced-scanner";
export { GlassmorphismCard, GlassmorphismStat, GlassmorphismBadge } from "./glassmorphism-card";
export { RevenueSummaryChart } from "./revenue-summary-chart";
export { CustomerAnalytics } from "./customer-analytics";
export { CommandPalette, CommandPaletteButton } from "./command-palette";
export { FloatingActionButton } from "./floating-action-button";
export { NotificationBell } from "./notification-bell";
export { WelcomeBanner } from "./welcome-banner";

// Skeletons
export {
  Skeleton,
  MetricCardSkeleton,
  ChartSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  PipelineSkeleton,
  ActivityFeedSkeleton,
  DashboardSkeleton,
} from "./animated-skeleton";

// New Components
export { ChartShipmentsInteractive } from "./chart-shipments-interactive";
export { SectionCards, type SectionCardData } from "./section-cards";
export { ShipmentsDataTable, type ShipmentRow } from "./shipments-data-table";
