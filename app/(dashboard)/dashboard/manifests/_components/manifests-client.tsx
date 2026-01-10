"use client";

import React, { useState, useTransition } from "react";
import {
    Plus,
    Lock,
    Truck,
    Package,
    ArrowRight,
    CheckCircle,
    FileText,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    createManifest,
    lockManifest,
    dispatchManifest,
    addShipmentToManifest
} from "@/app/actions/manifests";
import type { ManifestStatus } from "@/types/database";

interface Manifest {
    id: string;
    manifest_number: string;
    status: ManifestStatus;
    transport_mode: string | null;
    vehicle_number: string | null;
    driver_name: string | null;
    planned_departure: string | null;
    actual_departure: string | null;
    total_pieces: number | null;
    total_weight: number | null;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    created_at: string;
}

interface Shipment {
    id: string;
    reference: string;
    consignee_name: string | null;
    consignee_city: string | null;
    pieces: number | null;
    weight_kg: number | null;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface ManifestsClientProps {
    initialManifests: Manifest[];
    unassignedShipments: Shipment[];
    warehouses: Warehouse[];
}

const statusConfig: Record<ManifestStatus, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border", icon: FileText },
    finalized: { label: "Finalized", color: "bg-warning/10 text-warning border-warning/20", icon: Lock },
    dispatched: { label: "Dispatched", color: "bg-primary/10 text-primary border-primary/20", icon: Truck },
    in_transit: { label: "In Transit", color: "bg-primary/10 text-primary border-primary/20", icon: Truck },
    arrived: { label: "Arrived", color: "bg-primary/10 text-primary border-primary/20", icon: Package },
    completed: { label: "Completed", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
};

export function ManifestsClient({
    initialManifests,
    unassignedShipments: initialUnassigned,
    warehouses
}: Readonly<ManifestsClientProps>) {
    const [manifests, setManifests] = useState(initialManifests);
    const [unassigned, setUnassigned] = useState(initialUnassigned);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const draftManifests = manifests.filter(m => m.status === "draft");
    const finalizedManifests = manifests.filter(m => m.status === "finalized");
    const dispatchedManifests = manifests.filter(m => m.status === "dispatched" || m.status === "in_transit" || m.status === "arrived" || m.status === "completed");

    const handleLock = async (manifestId: string) => {
        startTransition(async () => {
            const result = await lockManifest(manifestId);
            if (result.success) {
                setManifests(prev =>
                    prev.map(m => m.id === manifestId ? { ...m, status: "finalized" as ManifestStatus } : m)
                );
                toast.success("Manifest locked");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleDispatch = async (manifestId: string) => {
        startTransition(async () => {
            const result = await dispatchManifest(manifestId);
            if (result.success) {
                setManifests(prev =>
                    prev.map(m => m.id === manifestId ? { ...m, status: "dispatched" as ManifestStatus } : m)
                );
                toast.success("Manifest dispatched");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleAddShipment = async (manifestId: string, shipmentRef: string) => {
        startTransition(async () => {
            const result = await addShipmentToManifest(manifestId, shipmentRef);
            if (result.success) {
                setUnassigned(prev => prev.filter(s => s.reference !== shipmentRef));
                toast.success("Shipment added to manifest");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {manifests.length} manifests • {unassigned.length} unassigned shipments
                    </span>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <Plus className="w-4 h-4" />
                            Create Manifest
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Manifest</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new manifest for shipping.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateManifestForm
                            warehouses={warehouses}
                            onSuccess={(newManifest) => {
                                setManifests(prev => [newManifest as Manifest, ...prev]);
                                setIsCreateOpen(false);
                                toast.success("Manifest created");
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-4">
                {/* Unassigned Shipments */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-card/50 rounded-xl p-4 border border-dashed border-border">
                    <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unassigned</span>
                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {unassigned.length}
                        </span>
                    </div>

                    {unassigned.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                            <span className="text-xs text-muted-foreground">No unassigned shipments</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {unassigned.map((shipment) => (
                                <ShipmentCard
                                    key={shipment.id}
                                    shipment={shipment}
                                    manifests={draftManifests}
                                    onAddToManifest={handleAddShipment}
                                    isPending={isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Draft/Open Manifests */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-card/50 rounded-xl p-4 border border-dashed border-border">
                    <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Open</span>
                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {draftManifests.length}
                        </span>
                    </div>

                    {draftManifests.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                            <span className="text-xs text-muted-foreground">No open manifests</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {draftManifests.map((manifest) => (
                                <ManifestCard
                                    key={manifest.id}
                                    manifest={manifest}
                                    onLock={handleLock}
                                    onDispatch={handleDispatch}
                                    isPending={isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Locked Manifests */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-card/50 rounded-xl p-4 border border-dashed border-warning/20">
                    <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-bold text-warning uppercase tracking-widest">Locked</span>
                        <span className="text-[10px] font-mono bg-warning/10 px-2 py-0.5 rounded text-warning">
                            {finalizedManifests.length}
                        </span>
                    </div>

                    {finalizedManifests.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                            <span className="text-xs text-muted-foreground">No locked manifests</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {finalizedManifests.map((manifest) => (
                                <ManifestCard
                                    key={manifest.id}
                                    manifest={manifest}
                                    onLock={handleLock}
                                    onDispatch={handleDispatch}
                                    isPending={isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Dispatched Manifests */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-card/50 rounded-xl p-4 border border-dashed border-primary/20">
                    <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">Dispatched</span>
                        <span className="text-[10px] font-mono bg-primary/10 px-2 py-0.5 rounded text-primary">
                            {dispatchedManifests.length}
                        </span>
                    </div>

                    {dispatchedManifests.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                            <span className="text-xs text-muted-foreground">No dispatched manifests</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {dispatchedManifests.map((manifest) => (
                                <ManifestCard
                                    key={manifest.id}
                                    manifest={manifest}
                                    onLock={handleLock}
                                    onDispatch={handleDispatch}
                                    isPending={isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ManifestCard({
    manifest,
    onLock,
    onDispatch,
    isPending
}: {
    manifest: Manifest;
    onLock: (id: string) => void;
    onDispatch: (id: string) => void;
    isPending: boolean;
}) {
    const status = statusConfig[manifest.status] || statusConfig.draft;
    const StatusIcon = status.icon;

    return (
        <div className={cn(
            "p-4 bg-card border rounded-lg transition-all",
            manifest.status === "finalized" ? "border-warning/20" :
                manifest.status === "dispatched" ? "border-primary/20" :
                    "border-border hover:border-primary/50"
        )}>
            <div className="flex justify-between mb-3">
                <span className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded border",
                    status.color
                )}>
                    {manifest.manifest_number}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground" disabled={isPending}>
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {manifest.status === "draft" ? (
                            <DropdownMenuItem onClick={() => onLock(manifest.id)}>
                                <Lock className="w-4 h-4 mr-2" />
                                Lock Manifest
                            </DropdownMenuItem>
                        ) : null}
                        {manifest.status === "finalized" && (
                            <DropdownMenuItem onClick={() => onDispatch(manifest.id)}>
                                <Truck className="w-4 h-4 mr-2" />
                                Dispatch
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                <span>{manifest.origin_warehouse?.code || "—"}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{manifest.destination_warehouse?.code || "—"}</span>
            </div>

            <div className="flex gap-3 text-[10px] text-muted-foreground border-t border-border pt-2 mt-2">
                <span>{manifest.total_pieces || 0} pcs</span>
                <span className="w-px h-3 bg-border"></span>
                <span>{manifest.total_weight || 0} kg</span>
                {manifest.driver_name && (
                    <>
                        <span className="w-px h-3 bg-border"></span>
                        <span>{manifest.driver_name}</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-1 mt-2">
                <StatusIcon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{status.label}</span>
            </div>
        </div>
    );
}

function ShipmentCard({
    shipment,
    manifests,
    onAddToManifest,
    isPending
}: {
    shipment: Shipment;
    manifests: Manifest[];
    onAddToManifest: (manifestId: string, shipmentRef: string) => void;
    isPending: boolean;
}) {
    return (
        <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all">
            <div className="flex justify-between mb-2">
                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                    {shipment.reference}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground" disabled={isPending}>
                            <Plus className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {manifests.length === 0 ? (
                            <DropdownMenuItem disabled>No open manifests</DropdownMenuItem>
                        ) : (
                            manifests.map((m) => (
                                <DropdownMenuItem
                                    key={m.id}
                                    onClick={() => onAddToManifest(m.id, shipment.reference)}
                                >
                                    Add to {m.manifest_number}
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="text-xs text-foreground mb-1">{shipment.consignee_name || "—"}</div>
            <div className="text-[10px] text-muted-foreground">{shipment.consignee_city || "—"}</div>

            <div className="flex gap-3 text-[10px] text-muted-foreground border-t border-border pt-2 mt-2">
                <span>{shipment.pieces || 0} pcs</span>
                <span className="w-px h-3 bg-border"></span>
                <span>{shipment.weight_kg || 0} kg</span>
            </div>
        </div>
    );
}

interface CreateManifestFormProps {
    warehouses: Warehouse[];
    onSuccess: (manifest: unknown) => void;
}

function CreateManifestForm({ warehouses, onSuccess }: CreateManifestFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState(() => ({
        manifest_number: `MNF-${new Date().getFullYear()}${Date.now().toString(36).toUpperCase()}`,
        origin_warehouse_id: "",
        destination_warehouse_id: "",
        transport_mode: "surface" as "air" | "surface" | "express" | "economy",
        vehicle_number: "",
        driver_name: "",
        driver_phone: "",
        planned_departure: new Date().toISOString().slice(0, 16),
        planned_arrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createManifest({
                ...formData,
                planned_departure: new Date(formData.planned_departure).toISOString(),
                planned_arrival: new Date(formData.planned_arrival).toISOString(),
            });
            if (result.success) {
                onSuccess(result.data);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Manifest Number</Label>
                    <Input
                        value={formData.manifest_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, manifest_number: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <select
                        value={formData.transport_mode}
                        onChange={(e) => setFormData(prev => ({ ...prev, transport_mode: e.target.value as "air" | "surface" | "express" | "economy" }))}
                        className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                    >
                        <option value="air">Air</option>
                        <option value="surface">Surface</option>
                        <option value="express">Express</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Origin Warehouse</Label>
                    <select
                        value={formData.origin_warehouse_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, origin_warehouse_id: e.target.value }))}
                        className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                        required
                    >
                        <option value="">Select origin</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Destination Warehouse</Label>
                    <select
                        value={formData.destination_warehouse_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, destination_warehouse_id: e.target.value }))}
                        className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                        required
                    >
                        <option value="">Select destination</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Planned Departure</Label>
                    <Input
                        type="datetime-local"
                        value={formData.planned_departure}
                        onChange={(e) => setFormData(prev => ({ ...prev, planned_departure: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Planned Arrival</Label>
                    <Input
                        type="datetime-local"
                        value={formData.planned_arrival}
                        onChange={(e) => setFormData(prev => ({ ...prev, planned_arrival: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Driver Details (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Driver Name</Label>
                        <Input
                            value={formData.driver_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Vehicle Number</Label>
                        <Input
                            value={formData.vehicle_number}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Manifest"}
                </Button>
            </div>
        </form>
    );
}
