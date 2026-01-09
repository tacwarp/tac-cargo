"use client";

import React, { useState, useTransition } from "react";
import { GlassPanel } from "../../_components/glass-panel";
import {
    Search,
    MoreHorizontal,
    ArrowRight,
    Plus,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    Tag,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createShipment, updateShipmentStatus, deleteShipment } from "@/app/actions/shipments";
import { generateLabelInvoice } from "@/app/actions/invoices";
import type { ShipmentStatus } from "@/types/database";

interface Shipment {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    consignee_state: string | null;
    pieces: number | null;
    weight_kg: number | null;
    transport_mode: string | null;
    created_at: string;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    customers: { name: string } | null;
    manifests: { manifest_number: string; status: string } | null;
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string;
}

interface ShipmentsTableClientProps {
    initialShipments: Shipment[];
    warehouses: Warehouse[];
    customers: Customer[];
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: "Pending", color: "bg-muted text-muted-foreground border-border", icon: Clock },
    picked_up: { label: "Picked Up", color: "bg-primary/10 text-primary border-primary/20", icon: Package },
    in_transit: { label: "In Transit", color: "bg-primary/10 text-primary border-primary/20", icon: Truck },
    out_for_delivery: { label: "Out for Delivery", color: "bg-warning/10 text-warning border-warning/20", icon: Truck },
    delivered: { label: "Delivered", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    failed: { label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    returned: { label: "Returned", color: "bg-warning/10 text-warning border-warning/20", icon: RefreshCw },
    cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

export function ShipmentsTableClient({
    initialShipments,
    warehouses,
    customers
}: Readonly<ShipmentsTableClientProps>) {
    const [shipments, setShipments] = useState(initialShipments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const filteredShipments = shipments.filter((shipment) => {
        const matchesSearch =
            shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.consignee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.consignee_city?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleGenerateLabel = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await generateLabelInvoice({ shipmentId });
            if (result.success) {
                toast.success("Label generated successfully");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleUpdateStatus = async (shipmentId: string, status: ShipmentStatus) => {
        startTransition(async () => {
            const result = await updateShipmentStatus(shipmentId, status);
            if (result.success) {
                setShipments(prev =>
                    prev.map(s => s.id === shipmentId ? { ...s, status } : s)
                );
                toast.success("Status updated");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleDelete = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await deleteShipment(shipmentId);
            if (result.success) {
                setShipments(prev => prev.filter(s => s.id !== shipmentId));
                toast.success("Shipment cancelled");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <GlassPanel className="rounded-xl overflow-hidden border-0 p-0 bg-card text-foreground">
            {/* Toolbar */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-card/80">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-semibold text-foreground">Shipments</h2>
                    <span className="text-xs text-muted-foreground">{filteredShipments.length} items</span>
                </div>
                <div className="flex gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2 text-muted-foreground w-3.5 h-3.5" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-card border-border pl-8 pr-3 py-1.5 text-xs h-8 w-48 text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
                        className="bg-card border border-border rounded px-3 py-1.5 text-xs text-foreground h-8"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    {/* Create Button */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <Plus className="w-3.5 h-3.5" />
                                Create
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create Shipment</DialogTitle>
                            </DialogHeader>
                            <CreateShipmentForm
                                warehouses={warehouses}
                                customers={customers}
                                onSuccess={(newShipment) => {
                                    const shipment = newShipment as Shipment;
                                    setShipments(prev => [shipment, ...prev]);
                                    setIsCreateOpen(false);
                                    toast.success("Shipment created");
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-4 font-medium">Reference</th>
                            <th className="p-4 font-medium">Consignee</th>
                            <th className="p-4 font-medium">Route</th>
                            <th className="p-4 font-medium">Details</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Manifest</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border">
                        {filteredShipments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                    No shipments found
                                </td>
                            </tr>
                        ) : (
                            filteredShipments.map((shipment) => {
                                const status = statusConfig[shipment.status] || statusConfig.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={shipment.id} className="group hover:bg-muted/40 transition-colors">
                                        <td className="p-4">
                                            <div className="font-mono text-foreground text-xs font-medium">
                                                {shipment.reference}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                                {new Date(shipment.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-foreground text-xs">
                                                {shipment.consignee_name || "—"}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {[shipment.consignee_city, shipment.consignee_state].filter(Boolean).join(", ") || "—"}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-foreground">
                                                <span className="font-medium">{shipment.origin_warehouse?.code || "—"}</span>
                                                <ArrowRight className="text-muted-foreground w-3 h-3" />
                                                <span className="font-medium">{shipment.destination_warehouse?.code || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-muted-foreground text-xs">
                                                {shipment.pieces || 0} pcs • {shipment.weight_kg || 0} kg
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase">
                                                {shipment.transport_mode || "—"}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full border text-[10px] font-medium flex w-fit items-center gap-1",
                                                status.color
                                            )}>
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {shipment.manifests ? (
                                                <div className="text-xs text-foreground">
                                                    {shipment.manifests.manifest_number}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                        disabled={isPending}
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleGenerateLabel(shipment.id)}>
                                                        <Tag className="w-4 h-4 mr-2" />
                                                        Generate Label
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.id, "picked_up")}>
                                                        Mark as Picked Up
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.id, "in_transit")}>
                                                        Mark as In Transit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.id, "delivered")}>
                                                        Mark as Delivered
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(shipment.id)}
                                                        className="text-destructive"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Cancel Shipment
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </GlassPanel>
    );
}

interface CreateShipmentFormProps {
    warehouses: Warehouse[];
    customers: Customer[];
    onSuccess: (shipment: unknown) => void;
}

function CreateShipmentForm({ warehouses, customers, onSuccess }: CreateShipmentFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState(() => ({
        customer_id: "",
        reference: `SHP-${new Date().getFullYear()}${Date.now().toString(36).toUpperCase()}`,
        origin_warehouse_id: "",
        destination_warehouse_id: "",
        transport_mode: "surface" as "air" | "surface" | "express" | "economy",
        service_level_id: "",
        weight_kg: 1,
        pieces: 1,
        consignee_name: "",
        consignee_phone: "",
        consignee_email: "",
        consignee_address: "",
        consignee_city: "",
        consignee_state: "",
        consignee_pincode: "",
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createShipment(formData);
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
                    <Label>Customer</Label>
                    <select
                        value={formData.customer_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
                        className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                        required
                    >
                        <option value="">Select customer</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                        value={formData.reference}
                        onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                        required
                    />
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

            <div className="grid grid-cols-3 gap-4">
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
                        <option value="economy">Economy</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Pieces</Label>
                    <Input
                        type="number"
                        min={1}
                        value={formData.pieces}
                        onChange={(e) => setFormData(prev => ({ ...prev, pieces: parseInt(e.target.value) || 1 }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={formData.weight_kg}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) || 0 }))}
                        required
                    />
                </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Consignee Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={formData.consignee_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, consignee_name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={formData.consignee_phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, consignee_phone: e.target.value }))}
                            placeholder="+919876543210"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2 mt-4">
                    <Label>Address</Label>
                    <Input
                        value={formData.consignee_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, consignee_address: e.target.value }))}
                        required
                    />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                            value={formData.consignee_city}
                            onChange={(e) => setFormData(prev => ({ ...prev, consignee_city: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                            value={formData.consignee_state}
                            onChange={(e) => setFormData(prev => ({ ...prev, consignee_state: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input
                            value={formData.consignee_pincode}
                            onChange={(e) => setFormData(prev => ({ ...prev, consignee_pincode: e.target.value }))}
                            placeholder="123456"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Shipment"}
                </Button>
            </div>
        </form>
    );
}
