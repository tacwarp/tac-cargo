"use client";

import React, { useState, useTransition } from "react";
import {
    Search,
    Package,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    MoreHorizontal,
    RefreshCw,
    MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getTrackingInfo, markAsDelivered } from "@/app/actions/tracking";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { IllustratedEmptyState } from "@/components/dashboard/illustrated-empty-state";
import type { ShipmentStatus } from "@/types/database";

interface TrackingStats {
    pending: number;
    pickedUp: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    failed: number;
    delayed: number;
}

interface Shipment {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    transport_mode: string | null;
    created_at: string;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    manifests: { manifest_number: string } | null;
}

interface TrackingClientProps {
    stats: TrackingStats;
    initialShipments: Shipment[];
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    booked: { label: "Booked", color: "text-muted-foreground", bgColor: "bg-muted", icon: Clock },
    picked_up: { label: "Picked Up", color: "text-primary", bgColor: "bg-primary/10", icon: Package },
    at_origin_hub: { label: "At Origin Hub", color: "text-primary", bgColor: "bg-primary/10", icon: Package },
    in_transit: { label: "In Transit", color: "text-primary", bgColor: "bg-primary/10", icon: Truck },
    at_destination_hub: { label: "At Destination Hub", color: "text-primary", bgColor: "bg-primary/10", icon: Package },
    out_for_delivery: { label: "Out for Delivery", color: "text-warning", bgColor: "bg-warning/10", icon: Truck },
    delivered: { label: "Delivered", color: "text-success", bgColor: "bg-success/10", icon: CheckCircle },
    exception: { label: "Exception", color: "text-destructive", bgColor: "bg-destructive/10", icon: AlertCircle },
    returned: { label: "Returned", color: "text-warning", bgColor: "bg-warning/10", icon: RefreshCw },
    cancelled: { label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted", icon: Clock },
};

export function TrackingClient({ stats, initialShipments }: Readonly<TrackingClientProps>) {
    const [shipments, setShipments] = useState(initialShipments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
    const [selectedShipment, setSelectedShipment] = useState<{
        reference: string;
        status: ShipmentStatus;
        consignee_name: string | null;
        origin: string;
        destination: string;
        events: Array<{ status: string; description: string | null; created_at: string }>;
    } | null>(null);
    const [, startTransition] = useTransition();

    const filteredShipments = shipments.filter((s) => {
        const matchesSearch =
            s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.consignee_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleTrack = async (reference: string) => {
        startTransition(async () => {
            const result = await getTrackingInfo(reference);
            if (result.success) {
                setSelectedShipment({
                    reference: result.data.shipment.reference,
                    status: result.data.shipment.status,
                    consignee_name: result.data.shipment.consignee_name,
                    origin: result.data.shipment.origin,
                    destination: result.data.shipment.destination,
                    events: result.data.events.map(e => ({
                        status: e.status,
                        description: e.description,
                        created_at: e.created_at,
                    })),
                });
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleMarkDelivered = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await markAsDelivered(shipmentId);
            if (result.success) {
                setShipments(prev =>
                    prev.map(s => s.id === shipmentId ? { ...s, status: "delivered" as ShipmentStatus } : s)
                );
                toast.success("Marked as delivered");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Status Pipeline */}
            <GlassPanel className="p-4">
                <StatusPipeline
                    stages={[
                        { id: "pending", label: "Pending", count: stats.pending, icon: Clock, color: "text-slate-500 bg-slate-500/10" },
                        { id: "picked_up", label: "Picked Up", count: stats.pickedUp, icon: Package, color: "text-blue-500 bg-blue-500/10" },
                        { id: "in_transit", label: "In Transit", count: stats.inTransit, icon: Truck, color: "text-amber-500 bg-amber-500/10" },
                        { id: "out_for_delivery", label: "Out for Delivery", count: stats.outForDelivery, icon: MapPin, color: "text-purple-500 bg-purple-500/10" },
                        { id: "delivered", label: "Delivered", count: stats.delivered, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
                        { id: "failed", label: "Failed", count: stats.failed, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
                    ]}
                    onStageClick={(stageId) => setStatusFilter(stageId as ShipmentStatus | "all")}
                    activeStage={statusFilter !== "all" ? statusFilter : undefined}
                />
            </GlassPanel>

            {/* Search & Filter */}
            <GlassPanel className="p-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by reference or consignee..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
                        className="bg-card border border-border rounded px-4 py-2 text-sm text-foreground"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </GlassPanel>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Shipments List */}
                <div className="lg:col-span-2">
                    <GlassPanel className="p-0">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-sm font-medium text-foreground">
                                Shipments ({filteredShipments.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                            {filteredShipments.length === 0 ? (
                                <IllustratedEmptyState type="tracking" />
                            ) : (
                                filteredShipments.map((shipment) => {
                                    const status = statusConfig[shipment.status] || statusConfig.booked;
                                    const StatusIcon = status.icon;

                                    return (
                                        <div
                                            key={shipment.id}
                                            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => handleTrack(shipment.reference)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-lg", status.bgColor)}>
                                                        <StatusIcon className={cn("w-4 h-4", status.color)} />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-sm text-foreground">
                                                            {shipment.reference}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {shipment.consignee_name || "—"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-xs px-2 py-1 rounded",
                                                        status.bgColor, status.color
                                                    )}>
                                                        {status.label}
                                                    </span>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                className="p-1 text-muted-foreground hover:text-foreground"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleTrack(shipment.reference)}>
                                                                View Timeline
                                                            </DropdownMenuItem>
                                                            {shipment.status !== "delivered" && (
                                                                <DropdownMenuItem onClick={() => handleMarkDelivered(shipment.id)}>
                                                                    Mark as Delivered
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
                                                <span>{shipment.origin_warehouse?.code || "—"}</span>
                                                <ArrowRight className="w-3 h-3" />
                                                <span>{shipment.destination_warehouse?.code || "—"}</span>
                                                <span className="mx-2">•</span>
                                                <span>Updated {new Date(shipment.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </GlassPanel>
                </div>

                {/* Timeline Panel */}
                <GlassPanel className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">Tracking Timeline</h3>

                    {selectedShipment ? (
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-card/50 border border-border">
                                <div className="font-mono text-sm text-foreground">{selectedShipment.reference}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedShipment.consignee_name}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                    <span>{selectedShipment.origin}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span>{selectedShipment.destination}</span>
                                </div>
                            </div>

                            <div className="relative pl-6 border-l border-border space-y-4">
                                {selectedShipment.events.length === 0 ? (
                                    <div className="text-xs text-muted-foreground">No tracking events</div>
                                ) : (
                                    selectedShipment.events.map((event, idx) => {
                                        const isLatest = idx === 0;
                                        return (
                                            <div key={idx} className="relative">
                                                <div className={cn(
                                                    "absolute -left-[25px] w-3 h-3 rounded-full border-2",
                                                    isLatest
                                                        ? "bg-success border-success"
                                                        : "bg-card border-border"
                                                )} />
                                                <div className={cn(
                                                    "p-3 rounded-lg",
                                                    isLatest ? "bg-card/80 border border-border" : "opacity-60"
                                                )}>
                                                    <div className="text-xs font-medium text-foreground capitalize">
                                                        {event.status.replace(/_/g, " ")}
                                                    </div>
                                                    {event.description && (
                                                        <div className="text-[10px] text-muted-foreground mt-1">
                                                            {event.description}
                                                        </div>
                                                    )}
                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                        {new Date(event.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                            Select a shipment to view timeline
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
