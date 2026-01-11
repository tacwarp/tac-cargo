"use client";

import React, { useState, useTransition } from "react";
import {
    Search,
    Package,
    MapPin,
    ArrowRight,
    Truck,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { searchInventory } from "@/app/actions/inventory";
import type { ShipmentStatus } from "@/types/database";

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface InventoryItem {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    pieces: number | null;
    weight_kg: number | null;
    manifest_id: string | null;
    created_at: string;
    origin_warehouse: { id: string; name: string; code: string } | null;
    destination_warehouse: { id: string; name: string; code: string } | null;
    manifests: { manifest_number: string; status: string } | null;
}

interface InventoryClientProps {
    warehouses: Warehouse[];
    initialInventory: InventoryItem[];
}

const statusColors: Record<ShipmentStatus, string> = {
    booked: "text-muted-foreground bg-muted",
    picked_up: "text-primary bg-primary/10",
    at_origin_hub: "text-primary bg-primary/10",
    in_transit: "text-primary bg-primary/10",
    at_destination_hub: "text-primary bg-primary/10",
    out_for_delivery: "text-warning bg-warning/10",
    delivered: "text-success bg-success/10",
    exception: "text-destructive bg-destructive/10",
    returned: "text-warning bg-warning/10",
    cancelled: "text-muted-foreground bg-muted",
};

export function InventoryClient({ warehouses, initialInventory }: InventoryClientProps) {
    const [inventory] = useState(initialInventory);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
    const [, startTransition] = useTransition();

    // Group inventory by warehouse
    const warehouseGroups = warehouses.map((warehouse) => {
        const items = inventory.filter(
            (item) =>
                item.origin_warehouse?.id === warehouse.id ||
                item.destination_warehouse?.id === warehouse.id
        );
        return { warehouse, items };
    });

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consignee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consignee_city?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesWarehouse =
            selectedWarehouse === "all" ||
            item.origin_warehouse?.id === selectedWarehouse ||
            item.destination_warehouse?.id === selectedWarehouse;

        return matchesSearch && matchesWarehouse;
    });

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        startTransition(async () => {
            const result = await searchInventory(searchQuery);
            if (result.success) {
                toast.success(`Found ${result.data.length} items`);
            } else {
                toast.error(result.error);
            }
        });
    };

    // Stats
    const totalPieces = filteredInventory.reduce((sum, item) => sum + (item.pieces || 0), 0);
    const inManifest = filteredInventory.filter((item) => item.manifest_id).length;
    const notInManifest = filteredInventory.filter((item) => !item.manifest_id).length;

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <GlassPanel className="p-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by tracking ID, customer, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="bg-card border border-border rounded px-4 py-2 text-sm text-foreground"
                    >
                        <option value="all">All Warehouses</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                    </select>
                </div>
            </GlassPanel>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Package}
                    label="Total Items"
                    value={filteredInventory.length}
                    color="text-foreground"
                />
                <StatCard
                    icon={Package}
                    label="Total Pieces"
                    value={totalPieces}
                    color="text-primary"
                />
                <StatCard
                    icon={Truck}
                    label="In Manifest"
                    value={inManifest}
                    color="text-success"
                />
                <StatCard
                    icon={Clock}
                    label="Not in Manifest"
                    value={notInManifest}
                    color="text-warning"
                    highlight={notInManifest > 0}
                />
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredInventory.length === 0 ? (
                    <GlassPanel className="col-span-full p-12 text-center">
                        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-muted-foreground">No items found</div>
                    </GlassPanel>
                ) : (
                    filteredInventory.map((item) => (
                        <InventoryCard key={item.id} item={item} />
                    ))
                )}
            </div>

            {/* Warehouse Summary */}
            <div className="mt-8">
                <h2 className="text-sm font-medium text-foreground mb-4">Warehouse Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {warehouseGroups.map(({ warehouse, items }) => (
                        <GlassPanel key={warehouse.id} className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">{warehouse.name}</div>
                                    <div className="text-xs text-muted-foreground">{warehouse.code}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-muted/50">
                                    <div className="text-muted-foreground">Items</div>
                                    <div className="text-foreground font-medium">{items.length}</div>
                                </div>
                                <div className="p-2 rounded bg-muted/50">
                                    <div className="text-muted-foreground">Pieces</div>
                                    <div className="text-foreground font-medium">
                                        {items.reduce((sum, i) => sum + (i.pieces || 0), 0)}
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InventoryCard({ item }: { item: InventoryItem }) {
    return (
        <GlassPanel className="p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="font-mono text-sm text-foreground">{item.reference}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.consignee_name || "—"}</div>
                </div>
                <span className={cn(
                    "text-[10px] px-2 py-1 rounded capitalize",
                    statusColors[item.status]
                )}>
                    {item.status.replace(/_/g, " ")}
                </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span>{item.origin_warehouse?.code || "—"}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{item.destination_warehouse?.code || "—"}</span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                <div className="text-muted-foreground">
                    {item.pieces || 0} pcs • {item.weight_kg || 0} kg
                </div>
                {item.manifests ? (
                    <span className="text-primary text-[10px]">
                        {item.manifests.manifest_number}
                    </span>
                ) : (
                    <span className="text-warning text-[10px]">Not in manifest</span>
                )}
            </div>
        </GlassPanel>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    highlight
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    color: string;
    highlight?: boolean;
}) {
    return (
        <GlassPanel className={cn(
            "p-4",
            highlight && "border-warning/30 bg-warning/5"
        )}>
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", highlight ? "bg-warning/10" : "bg-muted")}>
                    <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div>
                    <div className={cn("text-xl font-bold", color)}>{value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
            </div>
        </GlassPanel>
    );
}
