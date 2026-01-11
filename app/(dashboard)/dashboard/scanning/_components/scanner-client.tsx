"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import {
    Scan,
    Package,
    Truck,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    History,
    Keyboard,
    Camera
} from "lucide-react";

// Dynamic import to avoid SSR issues with html5-qrcode
const CameraScanner = dynamic(
    () => import("@/components/scanner/camera-scanner"),
    { ssr: false, loading: () => <div className="h-[200px] bg-muted/50 rounded-lg animate-pulse" /> }
);
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { processScan, lookupByBarcode } from "@/app/actions/scanning";
import type { ShipmentStatus } from "@/types/database";

type ScanType = "pickup" | "warehouse_in" | "warehouse_out" | "manifest_load" | "out_for_delivery" | "delivered" | "failed_delivery";

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface ScanEvent {
    id: string;
    scan_type: string;
    created_at: string;
    shipments: { reference: string; consignee_name: string; status: string } | null;
    profiles: { full_name: string } | null;
}

interface ScannerClientProps {
    warehouses: Warehouse[];
    initialRecentScans: ScanEvent[];
}

const scanTypeConfig: Record<ScanType, { label: string; icon: React.ElementType; color: string }> = {
    pickup: { label: "Pickup", icon: Package, color: "bg-primary" },
    warehouse_in: { label: "Warehouse In", icon: Truck, color: "bg-primary" },
    warehouse_out: { label: "Warehouse Out", icon: Truck, color: "bg-warning" },
    manifest_load: { label: "Load to Manifest", icon: Package, color: "bg-primary" },
    out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-warning" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "bg-success" },
    failed_delivery: { label: "Failed Delivery", icon: AlertCircle, color: "bg-destructive" },
};

const statusColors: Record<ShipmentStatus, string> = {
    booked: "text-muted-foreground",
    picked_up: "text-primary",
    at_origin_hub: "text-primary",
    in_transit: "text-primary",
    at_destination_hub: "text-primary",
    out_for_delivery: "text-warning",
    delivered: "text-success",
    exception: "text-destructive",
    returned: "text-warning",
    cancelled: "text-muted-foreground",
};

type ScanMode = "manual" | "camera";

export function ScannerClient({ warehouses, initialRecentScans }: ScannerClientProps) {
    const [barcodeInput, setBarcodeInput] = useState("");
    const [selectedScanType, setSelectedScanType] = useState<ScanType>("warehouse_in");
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || "");
    const [scanMode, setScanMode] = useState<ScanMode>("manual");
    const [lastScanResult, setLastScanResult] = useState<{
        success: boolean;
        shipment?: {
            reference: string;
            consignee_name: string | null;
            status: ShipmentStatus;
            origin?: string;
            destination?: string;
        };
        message?: string;
    } | null>(null);
    const [recentScans, setRecentScans] = useState(initialRecentScans);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input on mount and after each scan
    useEffect(() => {
        inputRef.current?.focus();
    }, [lastScanResult]);

    // Handle barcode submission
    const handleScan = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!barcodeInput.trim()) return;

        const barcode = barcodeInput.trim().toUpperCase();
        setBarcodeInput("");

        startTransition(async () => {
            const result = await processScan(barcode, selectedScanType, selectedWarehouse);

            if (result.success) {
                setLastScanResult({
                    success: true,
                    shipment: {
                        reference: result.data.shipment.reference,
                        consignee_name: result.data.shipment.consignee_name,
                        status: result.data.newStatus,
                    },
                    message: `${barcode} → ${scanTypeConfig[selectedScanType].label}`,
                });

                // Play success sound
                playBeep(true);

                // Add to recent scans
                setRecentScans(prev => [{
                    id: Date.now().toString(),
                    scan_type: selectedScanType,
                    created_at: new Date().toISOString(),
                    shipments: {
                        reference: result.data.shipment.reference,
                        consignee_name: result.data.shipment.consignee_name || "",
                        status: result.data.newStatus,
                    },
                    profiles: null,
                }, ...prev.slice(0, 19)]);

                toast.success(`Scanned: ${barcode}`);
            } else {
                setLastScanResult({
                    success: false,
                    message: result.error,
                });
                playBeep(false);
                toast.error(result.error);
            }
        });
    };

    // Handle lookup only (no status change)
    const handleLookup = async () => {
        if (!barcodeInput.trim()) return;

        const barcode = barcodeInput.trim().toUpperCase();

        startTransition(async () => {
            const result = await lookupByBarcode(barcode);

            if (result.success) {
                const shipment = result.data as {
                    reference: string;
                    consignee_name: string | null;
                    status: ShipmentStatus;
                    origin_warehouse?: { name: string };
                    destination_warehouse?: { name: string };
                };

                setLastScanResult({
                    success: true,
                    shipment: {
                        reference: shipment.reference,
                        consignee_name: shipment.consignee_name,
                        status: shipment.status,
                        origin: shipment.origin_warehouse?.name,
                        destination: shipment.destination_warehouse?.name,
                    },
                    message: "Lookup only - no status change",
                });
            } else {
                setLastScanResult({
                    success: false,
                    message: result.error,
                });
                toast.error(result.error);
            }
        });
    };

    // Handle camera barcode scan
    const handleCameraScan = (barcode: string) => {
        startTransition(async () => {
            const result = await processScan(barcode, selectedScanType, selectedWarehouse);

            if (result.success) {
                setLastScanResult({
                    success: true,
                    shipment: {
                        reference: result.data.shipment.reference,
                        consignee_name: result.data.shipment.consignee_name,
                        status: result.data.newStatus,
                    },
                    message: `${barcode} → ${scanTypeConfig[selectedScanType].label}`,
                });

                playBeep(true);

                setRecentScans(prev => [{
                    id: Date.now().toString(),
                    scan_type: selectedScanType,
                    created_at: new Date().toISOString(),
                    shipments: {
                        reference: result.data.shipment.reference,
                        consignee_name: result.data.shipment.consignee_name || "",
                        status: result.data.newStatus,
                    },
                    profiles: null,
                }, ...prev.slice(0, 19)]);

                toast.success(`Camera scanned: ${barcode}`);
            } else {
                setLastScanResult({
                    success: false,
                    message: result.error,
                });
                playBeep(false);
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scanner Panel */}
            <div className="lg:col-span-2 space-y-6">
                {/* Scan Type Selector */}
                <GlassPanel className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(scanTypeConfig).map(([type, config]) => {
                            const Icon = config.icon;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedScanType(type as ScanType)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                        selectedScanType === type
                                            ? `${config.color} text-white shadow-lg`
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </GlassPanel>

                {/* Scanner Input */}
                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                        >
                            {warehouses.map((w) => (
                                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                            ))}
                        </select>

                        {/* Mode Toggle */}
                        <div className="flex rounded-lg border border-border overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setScanMode("manual")}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors",
                                    scanMode === "manual"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Keyboard className="w-3.5 h-3.5" />
                                Manual
                            </button>
                            <button
                                type="button"
                                onClick={() => setScanMode("camera")}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors",
                                    scanMode === "camera"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Camera className="w-3.5 h-3.5" />
                                Camera
                            </button>
                        </div>
                    </div>

                    {/* Camera Scanner */}
                    {scanMode === "camera" && (
                        <div className="mb-4">
                            <CameraScanner
                                onScan={handleCameraScan}
                                onError={(err) => toast.error(err)}
                            />
                        </div>
                    )}

                    {/* Manual Input */}
                    <form onSubmit={handleScan} className={cn("relative", scanMode === "camera" && "opacity-50")}>
                        <div className="relative">
                            <Scan className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                type="text"
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                placeholder="Scan barcode or enter reference..."
                                className="pl-14 pr-4 py-6 text-xl font-mono bg-card border-border focus:border-primary"
                                autoFocus
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                type="submit"
                                className="flex-1 gap-2"
                                disabled={isPending || !barcodeInput.trim()}
                            >
                                <Scan className="w-4 h-4" />
                                {isPending ? "Processing..." : `Scan as ${scanTypeConfig[selectedScanType].label}`}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleLookup}
                                disabled={isPending || !barcodeInput.trim()}
                                className="gap-2"
                            >
                                <Keyboard className="w-4 h-4" />
                                Lookup Only
                            </Button>
                        </div>
                    </form>

                    {/* Last Scan Result */}
                    {lastScanResult && (
                        <div className={cn(
                            "mt-6 p-4 rounded-lg border",
                            lastScanResult.success
                                ? "bg-success/10 border-success/30"
                                : "bg-destructive/10 border-destructive/30"
                        )}>
                            {lastScanResult.success && lastScanResult.shipment ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-lg text-foreground">
                                            {lastScanResult.shipment.reference}
                                        </span>
                                        <span className={cn(
                                            "text-sm font-medium",
                                            statusColors[lastScanResult.shipment.status]
                                        )}>
                                            {lastScanResult.shipment.status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {lastScanResult.shipment.consignee_name}
                                    </div>
                                    {lastScanResult.shipment.origin && lastScanResult.shipment.destination && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{lastScanResult.shipment.origin}</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span>{lastScanResult.shipment.destination}</span>
                                        </div>
                                    )}
                                    <div className="text-xs text-success mt-2">
                                        ✓ {lastScanResult.message}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-destructive">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{lastScanResult.message}</span>
                                </div>
                            )}
                        </div>
                    )}
                </GlassPanel>
            </div>

            {/* Recent Scans */}
            <GlassPanel className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <History className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-foreground">Recent Scans</h3>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {recentScans.length === 0 ? (
                        <div className="text-xs text-muted-foreground text-center py-8">No recent scans</div>
                    ) : (
                        recentScans.map((scan) => (
                            <div
                                key={scan.id}
                                className="p-3 rounded-lg bg-card/50 border border-border"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-xs text-foreground">
                                        {scan.shipments?.reference || "Unknown"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(scan.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground">
                                        {scan.shipments?.consignee_name || "—"}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {scan.scan_type.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassPanel>
        </div>
    );
}

function playBeep(success: boolean) {
    try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = success ? 800 : 300;
        oscillator.type = "sine";
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
        // Audio not available
    }
}
