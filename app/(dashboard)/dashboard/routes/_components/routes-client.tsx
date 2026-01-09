"use client";

import React, { useState } from "react";
import {
    Truck,
    MapPin,
    Phone,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import type { ManifestStatus } from "@/types/database";

interface Manifest {
    id: string;
    manifest_number: string;
    status: ManifestStatus;
    transport_mode: string | null;
    vehicle_number: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    planned_departure: string | null;
    actual_departure: string | null;
    planned_arrival: string | null;
    total_pieces: number | null;
    total_weight: number | null;
    origin_warehouse: { name: string; code: string; city: string | null } | null;
    destination_warehouse: { name: string; code: string; city: string | null } | null;
}

interface RoutesClientProps {
    manifests: Manifest[];
}

export function RoutesClient({ manifests }: RoutesClientProps) {
    const [selectedId, setSelectedId] = useState<string | null>(manifests[0]?.id || null);
    const selected = manifests.find(m => m.id === selectedId);

    return (
        <div className="h-[calc(100vh-160px)] rounded-xl border border-border bg-card relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-card via-muted to-card">
                <div className="absolute inset-0 opacity-20">
                    {/* Grid pattern */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: "50px 50px"
                    }} />
                </div>

                {/* Route visualization (placeholder) */}
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-2">
                                    <MapPin className="w-6 h-6 text-success" />
                                </div>
                                <div className="text-sm font-medium text-foreground">{selected.origin_warehouse?.code}</div>
                                <div className="text-xs text-muted-foreground">{selected.origin_warehouse?.city}</div>
                            </div>

                            <div className="flex-1 max-w-xs relative">
                                <div className="h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-success via-primary to-muted w-2/3 animate-pulse" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-[0_0_15px_var(--primary)]" />
                            </div>

                            <div className="text-center opacity-50">
                                <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center mx-auto mb-2">
                                    <MapPin className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">{selected.destination_warehouse?.code}</div>
                                <div className="text-xs text-muted-foreground">{selected.destination_warehouse?.city}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar - Active Routes */}
            <div className="absolute top-6 left-6 bottom-6 w-80 overflow-hidden rounded-xl">
                <GlassPanel className="h-full bg-background/90 border border-border backdrop-blur-md p-4 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                        <span className="text-xs font-mono text-foreground tracking-widest">ACTIVE ROUTES</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{manifests.length}</span>
                    </div>

                    {manifests.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            No active routes
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {manifests.map((manifest) => (
                                <div
                                    key={manifest.id}
                                    onClick={() => setSelectedId(manifest.id)}
                                    className={cn(
                                        "p-3 rounded-lg cursor-pointer transition-all",
                                        selectedId === manifest.id
                                            ? "bg-primary/10 border border-primary/30"
                                            : "border border-border hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-xs text-foreground">
                                            {manifest.manifest_number}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded",
                                            manifest.status === "dispatched"
                                                ? "bg-primary/20 text-primary"
                                                : "bg-warning/20 text-warning"
                                        )}>
                                            {manifest.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{manifest.origin_warehouse?.code}</span>
                                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        <span>{manifest.destination_warehouse?.code}</span>
                                    </div>
                                    {manifest.driver_name && (
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            {manifest.driver_name} • {manifest.vehicle_number}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </GlassPanel>
            </div>

            {/* Detail Panel */}
            {selected && (
                <div className="absolute top-6 right-6 w-72">
                    <GlassPanel className="bg-background/90 border border-border backdrop-blur-md p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-foreground">{selected.manifest_number}</span>
                        </div>

                        <div className="space-y-4 relative pl-4 border-l border-border">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Origin</div>
                                <div className="text-sm text-foreground mt-0.5">{selected.origin_warehouse?.name}</div>
                                {selected.actual_departure && (
                                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                        {new Date(selected.actual_departure).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background shadow-[0_0_10px_var(--primary)]" />
                                <div className="text-[10px] text-muted-foreground uppercase font-semibold">In Transit</div>
                                <div className="text-sm text-foreground mt-0.5">{selected.transport_mode?.toUpperCase()}</div>
                                <div className="text-[10px] font-mono text-primary mt-0.5">
                                    {selected.total_pieces} pcs • {selected.total_weight} kg
                                </div>
                            </div>

                            <div className="relative opacity-50">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-muted border-2 border-background" />
                                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Destination</div>
                                <div className="text-sm text-foreground mt-0.5">{selected.destination_warehouse?.name}</div>
                                {selected.planned_arrival && (
                                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                        Est. {new Date(selected.planned_arrival).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selected.driver_name && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Truck className="w-3 h-3" />
                                    <span>{selected.driver_name}</span>
                                </div>
                                {selected.driver_phone && (
                                    <a
                                        href={`tel:${selected.driver_phone}`}
                                        className="flex items-center gap-2 text-xs text-primary mt-1 hover:underline"
                                    >
                                        <Phone className="w-3 h-3" />
                                        <span>{selected.driver_phone}</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </GlassPanel>
                </div>
            )}
        </div>
    );
}
