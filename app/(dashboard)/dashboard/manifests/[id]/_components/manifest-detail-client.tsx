"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Printer,
  Package,
  Truck,
  Clock,
  Copy,
  Check,
  MoreVertical,
  Ban,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateManifestStatus } from "@/app/actions/manifest-crud";
import type { ManifestStatus } from "@/types/database";

interface Shipment {
  id: string;
  reference: string;
  status: string;
  consignee_name: string | null;
  pieces: number | null;
  weight_kg: number | null;
}

interface ManifestWithRelations {
  id: string;
  manifest_number: string;
  status: ManifestStatus;
  transport_mode: string | null;
  vehicle_number: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  seal_number: string | null;
  planned_departure: string | null;
  actual_departure: string | null;
  planned_arrival: string | null;
  actual_arrival: string | null;
  total_pieces: number | null;
  total_weight: number | null;
  notes: string | null;
  created_at: string;
  origin_warehouse?: {
    id: string;
    name: string;
    code: string;
    city: string | null;
  } | null;
  destination_warehouse?: {
    id: string;
    name: string;
    code: string;
    city: string | null;
  } | null;
  shipments?: Shipment[];
}

interface ManifestDetailClientProps {
  manifest: ManifestWithRelations;
}

const statusConfig: Record<ManifestStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  finalized: { label: "Finalized", color: "bg-blue-100 text-blue-700" },
  dispatched: { label: "Dispatched", color: "bg-amber-100 text-amber-700" },
  in_transit: { label: "In Transit", color: "bg-purple-100 text-purple-700" },
  arrived: { label: "Arrived", color: "bg-cyan-100 text-cyan-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
};

export function ManifestDetailClient({ manifest }: ManifestDetailClientProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState<ManifestStatus | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const status = statusConfig[manifest.status] || statusConfig.draft;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(manifest.manifest_number);
    setCopied(true);
    toast.success("Manifest number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = async () => {
    if (!nextStatus) return;
    setIsUpdating(true);
    try {
      const result = await updateManifestStatus(manifest.id, nextStatus);
      if (result.success) {
        toast.success(`Manifest status updated to ${statusConfig[nextStatus].label}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
      setShowStatusDialog(false);
      setNextStatus(null);
    }
  };

  const getNextStatuses = (): ManifestStatus[] => {
    switch (manifest.status) {
      case "draft": return ["finalized"];
      case "finalized": return ["dispatched"];
      case "dispatched": return ["in_transit"];
      case "in_transit": return ["arrived"];
      case "arrived": return ["completed"];
      default: return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/manifests">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{manifest.manifest_number}</h1>
              <button
                onClick={handleCopyNumber}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <Badge className={cn("ml-2", status.color)}>{status.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {format(new Date(manifest.created_at), "dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getNextStatuses().length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setNextStatus(getNextStatuses()[0]);
                setShowStatusDialog(true);
              }}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {manifest.status === "draft" ? "Finalize" : 
               manifest.status === "finalized" ? "Dispatch" :
               manifest.status === "dispatched" ? "Start Transit" :
               manifest.status === "in_transit" ? "Mark Arrived" :
               "Complete"}
            </Button>
          )}
          
          {isHydrated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/manifests/${manifest.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Manifest
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Manifest
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {manifest.status !== "completed" && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setNextStatus("draft" as ManifestStatus);
                      setShowStatusDialog(true);
                    }}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Reset to Draft
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Shipments</div>
                <div className="text-xl font-bold">{manifest.shipments?.length || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Pieces</div>
                <div className="text-xl font-bold">{manifest.total_pieces || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Truck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Weight</div>
                <div className="text-xl font-bold">{manifest.total_weight || 0} kg</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Mode</div>
                <div className="text-xl font-bold capitalize">{manifest.transport_mode || "Air"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Origin</CardTitle>
          </CardHeader>
          <CardContent>
            {manifest.origin_warehouse ? (
              <>
                <div className="font-medium">
                  <Badge variant="outline" className="mr-2">{manifest.origin_warehouse.code}</Badge>
                  {manifest.origin_warehouse.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {manifest.origin_warehouse.city}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Not specified</span>
            )}
            {manifest.planned_departure && (
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">Planned: </span>
                {format(new Date(manifest.planned_departure), "dd MMM yyyy, HH:mm")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Destination</CardTitle>
          </CardHeader>
          <CardContent>
            {manifest.destination_warehouse ? (
              <>
                <div className="font-medium">
                  <Badge variant="outline" className="mr-2">{manifest.destination_warehouse.code}</Badge>
                  {manifest.destination_warehouse.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {manifest.destination_warehouse.city}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Not specified</span>
            )}
            {manifest.planned_arrival && (
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">ETA: </span>
                {format(new Date(manifest.planned_arrival), "dd MMM yyyy, HH:mm")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vehicle & Driver */}
      {(manifest.vehicle_number || manifest.driver_name) && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Driver Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {manifest.vehicle_number && (
              <div>
                <div className="text-sm text-muted-foreground">Vehicle Number</div>
                <div className="font-medium">{manifest.vehicle_number}</div>
              </div>
            )}
            {manifest.driver_name && (
              <div>
                <div className="text-sm text-muted-foreground">Driver Name</div>
                <div className="font-medium">{manifest.driver_name}</div>
              </div>
            )}
            {manifest.driver_phone && (
              <div>
                <div className="text-sm text-muted-foreground">Driver Phone</div>
                <div className="font-medium">{manifest.driver_phone}</div>
              </div>
            )}
            {manifest.seal_number && (
              <div>
                <div className="text-sm text-muted-foreground">Seal Number</div>
                <div className="font-medium">{manifest.seal_number}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipments Table */}
      {manifest.shipments && manifest.shipments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Shipments in Manifest</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Consignee</TableHead>
                  <TableHead className="text-center">Pieces</TableHead>
                  <TableHead className="text-center">Weight</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manifest.shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link 
                        href={`/dashboard/shipments/${shipment.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {shipment.reference}
                      </Link>
                    </TableCell>
                    <TableCell>{shipment.consignee_name || "-"}</TableCell>
                    <TableCell className="text-center">{shipment.pieces || 0}</TableCell>
                    <TableCell className="text-center">{shipment.weight_kg || 0} kg</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="capitalize">
                        {shipment.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Status Update Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Manifest Status</AlertDialogTitle>
            <AlertDialogDescription>
              {nextStatus && `Are you sure you want to update the status to "${statusConfig[nextStatus]?.label}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
