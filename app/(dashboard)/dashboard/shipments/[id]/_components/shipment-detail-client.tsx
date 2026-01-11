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
  MapPin,
  Truck,
  Clock,
  Copy,
  Check,
  MoreVertical,
  Ban,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cancelShipment } from "@/app/actions/shipments";
import type { ShipmentStatus } from "@/types/database";

interface TrackingEvent {
  id: string;
  status: string;
  location: string | null;
  description: string | null;
  created_at: string;
}

interface ShipmentWithRelations {
  id: string;
  reference: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
  
  // Customer
  customer_id: string | null;
  customers?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    gst_number: string | null;
  } | null;
  
  // Consignee
  consignee_name: string | null;
  consignee_phone: string | null;
  consignee_email: string | null;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;
  
  // Shipment details
  transport_mode: string | null;
  payment_mode: string | null;
  pieces: number | null;
  weight_kg: number | null;
  volumetric_weight: number | null;
  chargeable_weight: number | null;
  declared_value: number | null;
  cod_amount: number | null;
  notes: string | null;
  special_instructions: string | null;
  
  // Warehouses
  origin_warehouse?: {
    id: string;
    name: string;
    code: string;
    city: string | null;
    state: string | null;
  } | null;
  destination_warehouse?: {
    id: string;
    name: string;
    code: string;
    city: string | null;
    state: string | null;
  } | null;
  
  // Manifest
  manifests?: {
    id: string;
    manifest_number: string;
    status: string;
  } | null;
  
  // Tracking
  tracking_events?: TrackingEvent[];
  
  // Invoices
  invoices?: Array<{
    id: string;
    invoice_no: string;
    status: string;
    total_amount: number;
  }>;
}

interface ShipmentDetailClientProps {
  shipment: ShipmentWithRelations;
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string }> = {
  booked: { label: "Booked", color: "bg-blue-100 text-blue-700" },
  picked_up: { label: "Picked Up", color: "bg-indigo-100 text-indigo-700" },
  at_origin_hub: { label: "At Origin Hub", color: "bg-purple-100 text-purple-700" },
  in_transit: { label: "In Transit", color: "bg-amber-100 text-amber-700" },
  at_destination_hub: { label: "At Destination Hub", color: "bg-orange-100 text-orange-700" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-cyan-100 text-cyan-700" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700" },
  exception: { label: "Exception", color: "bg-red-100 text-red-700" },
  returned: { label: "Returned", color: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground line-through" },
};

export function ShipmentDetailClient({ shipment }: ShipmentDetailClientProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const status = statusConfig[shipment.status] || statusConfig.booked;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(shipment.reference);
    setCopied(true);
    toast.success("Reference number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelShipment(shipment.id);
      if (result.success) {
        toast.success("Shipment cancelled");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel shipment");
      }
    } catch {
      toast.error("Failed to cancel shipment");
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/shipments">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{shipment.reference}</h1>
              <button
                onClick={handleCopyReference}
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
              Created {format(new Date(shipment.created_at), "dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/shipments/${shipment.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          
          {isHydrated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Label
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={shipment.status === "cancelled" || shipment.status === "delivered"}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Cancel Shipment
                </DropdownMenuItem>
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
                <div className="text-sm text-muted-foreground">Pieces</div>
                <div className="text-xl font-bold">{shipment.pieces || 1}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Weight</div>
                <div className="text-xl font-bold">{shipment.weight_kg || 0} kg</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Destination</div>
                <div className="text-xl font-bold truncate">
                  {shipment.consignee_city || shipment.destination_warehouse?.city || "-"}
                </div>
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
                <div className="text-xl font-bold capitalize">
                  {shipment.transport_mode || "Air"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Origin / Shipper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">
              {shipment.customers?.name || "TAC Cargo"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {shipment.origin_warehouse?.name && (
                <div>
                  <Badge variant="outline" className="mr-2">{shipment.origin_warehouse.code}</Badge>
                  {shipment.origin_warehouse.name}
                </div>
              )}
              {shipment.customers?.address && (
                <>
                  {shipment.customers.address}
                  <br />
                  {shipment.customers.city}, {shipment.customers.state} {shipment.customers.pincode}
                </>
              )}
            </div>
            {shipment.customers?.phone && (
              <div className="text-sm mt-2">Phone: {shipment.customers.phone}</div>
            )}
          </CardContent>
        </Card>

        {/* Destination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Destination / Consignee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{shipment.consignee_name || "-"}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {shipment.destination_warehouse?.name && (
                <div>
                  <Badge variant="outline" className="mr-2">{shipment.destination_warehouse.code}</Badge>
                  {shipment.destination_warehouse.name}
                </div>
              )}
              {shipment.consignee_address}
              <br />
              {shipment.consignee_city}, {shipment.consignee_state} {shipment.consignee_pincode}
            </div>
            {shipment.consignee_phone && (
              <div className="text-sm mt-2">Phone: {shipment.consignee_phone}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tracking Timeline */}
      {shipment.tracking_events && shipment.tracking_events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipment.tracking_events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      index === 0 ? "bg-primary" : "bg-muted"
                    )} />
                    {index < shipment.tracking_events!.length - 1 && (
                      <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium capitalize">
                      {event.status.replace(/_/g, " ")}
                    </div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.location && `${event.location} • `}
                      {format(new Date(event.created_at), "dd MMM yyyy, HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Invoices */}
      {shipment.invoices && shipment.invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shipment.invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{invoice.invoice_no}</div>
                    <div className="text-sm text-muted-foreground capitalize">{invoice.status}</div>
                  </div>
                  <div className="font-mono font-medium">
                    ₹{invoice.total_amount.toLocaleString("en-IN")}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {(shipment.notes || shipment.special_instructions) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes & Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shipment.notes && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                <p className="text-sm">{shipment.notes}</p>
              </div>
            )}
            {shipment.special_instructions && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Special Instructions</div>
                <p className="text-sm">{shipment.special_instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Shipment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the shipment as cancelled. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Shipment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Cancel Shipment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
