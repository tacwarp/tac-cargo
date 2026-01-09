"use client";

import React, { useState, useTransition } from "react";
import {
    AlertOctagon,
    Clock,
    AlertTriangle,
    CheckCircle,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateShipmentStatus } from "@/app/actions/shipments";
import type { ShipmentStatus } from "@/types/database";

type ExceptionType = "failed" | "delayed";

interface Exception {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    exception_type: ExceptionType;
}

interface ExceptionsClientProps {
    initialExceptions: Exception[];
}

const exceptionConfig: Record<ExceptionType, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    failed: { label: "Failed Delivery", color: "text-destructive", bgColor: "bg-destructive/10", icon: AlertOctagon },
    delayed: { label: "Delayed", color: "text-warning", bgColor: "bg-warning/10", icon: Clock },
};

export function ExceptionsClient({ initialExceptions }: Readonly<ExceptionsClientProps>) {
    const [exceptions, setExceptions] = useState(initialExceptions);
    const [selectedId, setSelectedId] = useState<string | null>(initialExceptions[0]?.id || null);
    const [isPending, startTransition] = useTransition();

    const selected = exceptions.find(e => e.id === selectedId);
    const failedCount = exceptions.filter(e => e.exception_type === "failed").length;
    const delayedCount = exceptions.filter(e => e.exception_type === "delayed").length;

    const handleResolve = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await updateShipmentStatus(shipmentId, "pending");
            if (result.success) {
                setExceptions(prev => prev.filter(e => e.id !== shipmentId));
                setSelectedId(exceptions.find(e => e.id !== shipmentId)?.id || null);
                toast.success("Exception resolved - shipment reset to pending");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleRetry = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await updateShipmentStatus(shipmentId, "out_for_delivery");
            if (result.success) {
                setExceptions(prev => prev.filter(e => e.id !== shipmentId));
                setSelectedId(exceptions.find(e => e.id !== shipmentId)?.id || null);
                toast.success("Shipment marked for re-delivery");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                            <AlertOctagon className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-destructive">{failedCount}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Failed Deliveries</div>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning/10">
                            <Clock className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-warning">{delayedCount}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Delayed Shipments</div>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                            <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-foreground">{exceptions.length}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Total Exceptions</div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {exceptions.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Exceptions</h3>
                    <p className="text-sm text-muted-foreground">All shipments are on track</p>
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* List */}
                    <div className="md:col-span-1 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {exceptions.map((exception) => {
                            const config = exceptionConfig[exception.exception_type];
                            const isSelected = selectedId === exception.id;

                            return (
                                <div
                                    key={exception.id}
                                    onClick={() => setSelectedId(exception.id)}
                                    className={cn(
                                        "p-4 rounded-lg cursor-pointer transition-all relative overflow-hidden",
                                        isSelected
                                            ? `${config.bgColor} border ${exception.exception_type === "failed" ? "border-destructive/30" : "border-warning/30"}`
                                            : "border border-border hover:bg-muted/50"
                                    )}
                                >
                                    {isSelected && (
                                        <div className={cn(
                                            "absolute left-0 top-0 bottom-0 w-1",
                                            exception.exception_type === "failed" ? "bg-destructive" : "bg-warning"
                                        )} />
                                    )}
                                    <div className="flex justify-between mb-2">
                                        <span className={cn(
                                            "text-[10px] font-mono px-1 rounded",
                                            isSelected ? config.color : "text-muted-foreground",
                                            isSelected ? config.bgColor : "bg-muted"
                                        )}>
                                            {exception.reference}
                                        </span>
                                        <span className={cn(
                                            "text-[10px]",
                                            isSelected ? config.color : "text-muted-foreground"
                                        )}>
                                            {getTimeAgo(exception.updated_at)}
                                        </span>
                                    </div>
                                    <h4 className={cn(
                                        "text-sm font-semibold transition-colors",
                                        isSelected ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {config.label}
                                    </h4>
                                    <p className={cn(
                                        "text-xs mt-1 truncate",
                                        isSelected ? config.color : "text-muted-foreground"
                                    )}>
                                        {exception.consignee_name || "Unknown"} • {exception.consignee_city || "—"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Detail */}
                    {selected && (
                        <GlassPanel className="md:col-span-2 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    exceptionConfig[selected.exception_type].bgColor
                                )}>
                                    {React.createElement(exceptionConfig[selected.exception_type].icon, {
                                        className: cn("w-6 h-6", exceptionConfig[selected.exception_type].color)
                                    })}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {exceptionConfig[selected.exception_type].label}
                                    </h2>
                                    <div className={cn(
                                        "text-xs mt-1 font-mono",
                                        exceptionConfig[selected.exception_type].color
                                    )}>
                                        {selected.reference} • {selected.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-card border border-border">
                                    <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">
                                        Consignee
                                    </div>
                                    <div className="text-sm text-foreground">{selected.consignee_name || "Unknown"}</div>
                                    <div className="text-xs text-muted-foreground">{selected.consignee_city || "—"}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-card border border-border">
                                    <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">
                                        Route
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                        <span>{selected.origin_warehouse?.code || "—"}</span>
                                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        <span>{selected.destination_warehouse?.code || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-card border border-border mb-6">
                                <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-2">
                                    Last Updated
                                </div>
                                <div className="text-sm text-foreground">
                                    {new Date(selected.updated_at).toLocaleString("en-IN")}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {selected.exception_type === "failed"
                                        ? "Delivery attempt failed. Consignee unavailable or address issue."
                                        : "Shipment has been in transit longer than expected."
                                    }
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border">
                                {selected.exception_type === "failed" && (
                                    <Button
                                        onClick={() => handleRetry(selected.id)}
                                        disabled={isPending}
                                    >
                                        Retry Delivery
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => handleResolve(selected.id)}
                                    disabled={isPending}
                                >
                                    Mark Resolved
                                </Button>
                            </div>
                        </GlassPanel>
                    )}
                </div>
            )}
        </div>
    );
}

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}
