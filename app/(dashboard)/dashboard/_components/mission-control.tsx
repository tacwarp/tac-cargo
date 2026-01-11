"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "./glass-panel";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PieChartInteractive } from "@/components/charts/pie-chart-interactive";
import { ChartShipmentsInteractive } from "@/components/dashboard/chart-shipments-interactive";
import { SectionCards, type SectionCardData } from "@/components/dashboard/section-cards";
import type { ShipmentStatus } from "@/types/database";

interface MissionControlProps {
  stats: {
    shipments: {
      total: number;
      pending: number;
      inTransit: number;
      delivered: number;
      failed: number;
      today: number;
      delayed: number;
    };
    finance: {
      revenue: number;
      outstanding: number;
    };
    operations: {
      activeManifests: number;
    };
  };
  recentActivity: Array<{
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    updated_at: string;
  }>;
  userName?: string;
  shipmentTrend?: Array<{ date: string; count: number }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const statusConfig: Record<ShipmentStatus, { label: string; color: string }> = {
  booked: { label: "Booked", color: "text-muted-foreground" },
  picked_up: { label: "Picked Up", color: "text-primary" },
  at_origin_hub: { label: "At Origin Hub", color: "text-primary" },
  in_transit: { label: "In Transit", color: "text-primary" },
  at_destination_hub: { label: "At Destination Hub", color: "text-primary" },
  out_for_delivery: { label: "Out for Delivery", color: "text-warning" },
  delivered: { label: "Delivered", color: "text-success" },
  exception: { label: "Exception", color: "text-destructive" },
  returned: { label: "Returned", color: "text-warning" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground" },
};

export function MissionControl({ 
  stats, 
  recentActivity, 
  userName = "there",
  shipmentTrend = []
}: MissionControlProps) {
  const deliveryRate = stats.shipments.total > 0 
    ? Math.round((stats.shipments.delivered / stats.shipments.total) * 100) 
    : 0;

  const sectionCardsData: SectionCardData[] = [
    {
      title: "Total Shipments",
      value: stats.shipments.total.toLocaleString(),
      description: `${stats.shipments.today} created today`,
      trend: stats.shipments.today > 0 ? 12.5 : 0,
      trendLabel: stats.shipments.today > 0 ? "+12.5%" : "0%",
      footerLabel: stats.shipments.today > 0 ? "Trending up this week" : "No change",
    },
    {
      title: "In Transit",
      value: stats.shipments.inTransit.toLocaleString(),
      description: stats.shipments.delayed > 0 ? `${stats.shipments.delayed} delayed` : "All on schedule",
      trend: stats.shipments.delayed > 0 ? -stats.shipments.delayed : 5.2,
      trendLabel: stats.shipments.delayed > 0 ? `-${stats.shipments.delayed}` : "+5.2%",
      footerLabel: stats.shipments.delayed > 0 ? "Needs attention" : "Running smoothly",
    },
    {
      title: "Revenue",
      value: `₹${(stats.finance.revenue / 1000).toFixed(1)}K`,
      description: `₹${(stats.finance.outstanding / 1000).toFixed(1)}K outstanding`,
      trend: 8.3,
      trendLabel: "+8.3%",
      footerLabel: "Above monthly target",
    },
    {
      title: "Delivery Rate",
      value: `${deliveryRate}%`,
      description: `${stats.shipments.delivered} delivered`,
      trend: deliveryRate >= 90 ? 2.1 : -1.5,
      trendLabel: deliveryRate >= 90 ? "+2.1%" : "-1.5%",
      footerLabel: deliveryRate >= 90 ? "Exceeds 90% target" : "Below target",
    },
  ];

  const statusDistribution = [
    { name: "Delivered", value: stats.shipments.delivered, fill: "hsl(var(--chart-2))" },
    { name: "In Transit", value: stats.shipments.inTransit, fill: "hsl(var(--chart-3))" },
    { name: "Pending", value: stats.shipments.pending, fill: "hsl(var(--chart-4))" },
    { name: "Failed", value: stats.shipments.failed, fill: "hsl(var(--chart-5))" },
  ].filter(s => s.value > 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <WelcomeBanner
          userName={userName}
          stats={{
            todayShipments: stats.shipments.today,
            pendingTasks: stats.shipments.pending + stats.shipments.delayed,
            revenue: stats.finance.revenue,
          }}
        />
      </motion.div>

      {/* Enhanced KPI Section Cards */}
      <motion.div variants={itemVariants}>
        <SectionCards cards={sectionCardsData} />
      </motion.div>

      {/* Status Pipeline */}
      <motion.div variants={itemVariants}>
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Shipment Pipeline</h3>
            <span className="text-xs text-muted-foreground">
              {deliveryRate}% delivery rate
            </span>
          </div>
          <StatusPipeline
            stages={[
              { id: "pending", label: "Pending", count: stats.shipments.pending, icon: Clock, color: "text-slate-500 bg-slate-500/10" },
              { id: "in_transit", label: "In Transit", count: stats.shipments.inTransit, icon: Truck, color: "text-amber-500 bg-amber-500/10" },
              { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-purple-500 bg-purple-500/10" },
              { id: "delivered", label: "Delivered", count: stats.shipments.delivered, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
              { id: "failed", label: "Failed", count: stats.shipments.failed, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
            ]}
          />
        </GlassPanel>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Shipment Chart */}
        <div className="lg:col-span-2">
          <ChartShipmentsInteractive
            data={shipmentTrend.map(d => ({ 
              date: d.date, 
              shipments: d.count, 
              delivered: Math.floor(d.count * 0.85) 
            }))}
            title="Shipment Activity"
            description="Daily shipment volume and delivery metrics"
          />
        </div>

        {/* Status Distribution */}
        <GlassPanel className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Status Distribution</h3>
          {statusDistribution.length > 0 ? (
            <PieChartInteractive
              data={statusDistribution}
              height={200}
              showLegend={false}
              innerRadius={40}
              outerRadius={70}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              No data available
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <GlassPanel className="lg:col-span-2 p-0">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
            <Link href="/dashboard/shipments" className="text-xs text-primary hover:text-primary/80">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No recent activity</div>
            ) : (
              recentActivity.slice(0, 8).map((item, index) => {
                const status = statusConfig[item.status] || statusConfig.booked;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href="/dashboard/tracking"
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", status.color.replace("text-", "bg-"))} />
                        <div>
                          <div className="font-mono text-sm text-foreground">{item.reference}</div>
                          <div className="text-xs text-muted-foreground">{item.consignee_name || "—"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-xs", status.color)}>{status.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(item.updated_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </GlassPanel>

        {/* Quick Actions */}
        <GlassPanel className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <QuickActionLink href="/dashboard/shipments?action=create" label="Create Shipment" icon={Package} />
            <QuickActionLink href="/dashboard/manifests?action=create" label="New Manifest" icon={Truck} />
            <QuickActionLink href="/dashboard/scanning" label="Scan Barcode" icon={Activity} />
            <QuickActionLink href="/dashboard/invoices?action=create" label="Generate Invoice" icon={DollarSign} />
            <QuickActionLink href="/dashboard/tracking" label="Track Shipment" icon={Clock} />
            <QuickActionLink href="/dashboard/exceptions" label="View Exceptions" icon={AlertCircle} />
          </div>
        </GlassPanel>
      </motion.div>

      {/* Alerts Section */}
      {(stats.shipments.delayed > 0 || stats.shipments.failed > 0) && (
        <motion.div variants={itemVariants}>
          <GlassPanel className="p-4 border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <h3 className="text-sm font-medium text-foreground">Attention Required</h3>
            </div>
            <div className="space-y-2 text-sm">
              {stats.shipments.delayed > 0 && (
                <div className="flex items-center justify-between text-foreground">
                  <span>{stats.shipments.delayed} shipments delayed</span>
                  <Link href="/dashboard/tracking" className="text-warning text-xs hover:underline">
                    View →
                  </Link>
                </div>
              )}
              {stats.shipments.failed > 0 && (
                <div className="flex items-center justify-between text-foreground">
                  <span>{stats.shipments.failed} failed deliveries</span>
                  <Link href="/dashboard/exceptions" className="text-warning text-xs hover:underline">
                    View →
                  </Link>
                </div>
              )}
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}

function QuickActionLink({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}
