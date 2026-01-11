"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateShipment } from "@/app/actions/shipment-crud";
import { PhoneInput, getFullPhoneNumber } from "@/components/ui/phone-input";
import type { ShipmentStatus, TransportMode, PaymentMode } from "@/types/database";

interface Warehouse {
  id: string;
  name: string;
  code: string;
}

interface ShipmentWithRelations {
  id: string;
  reference: string;
  status: ShipmentStatus;
  consignee_name: string | null;
  consignee_phone: string | null;
  consignee_email: string | null;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;
  transport_mode: TransportMode | null;
  payment_mode: PaymentMode | null;
  pieces: number | null;
  weight_kg: number | null;
  declared_value: number | null;
  cod_amount: number | null;
  notes: string | null;
  special_instructions: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
}

interface ShipmentEditClientProps {
  shipment: ShipmentWithRelations;
  warehouses: Warehouse[];
}

export function ShipmentEditClient({ shipment, warehouses }: ShipmentEditClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    consignee_name: shipment.consignee_name || "",
    consignee_phone: shipment.consignee_phone?.replace(/\D/g, "").slice(-10) || "",
    consignee_email: shipment.consignee_email || "",
    consignee_address: shipment.consignee_address || "",
    consignee_city: shipment.consignee_city || "",
    consignee_state: shipment.consignee_state || "",
    consignee_pincode: shipment.consignee_pincode || "",
    transport_mode: shipment.transport_mode || "air",
    payment_mode: shipment.payment_mode || "prepaid",
    pieces: shipment.pieces || 1,
    weight_kg: shipment.weight_kg || 0,
    declared_value: shipment.declared_value || 0,
    cod_amount: shipment.cod_amount || 0,
    notes: shipment.notes || "",
    special_instructions: shipment.special_instructions || "",
    origin_warehouse_id: shipment.origin_warehouse_id || "",
    destination_warehouse_id: shipment.destination_warehouse_id || "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateShipment(shipment.id, {
        ...formData,
        consignee_phone: getFullPhoneNumber(formData.consignee_phone),
      });
      
      if (result.success) {
        toast.success("Shipment updated successfully");
        router.push(`/dashboard/shipments/${shipment.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update shipment");
      }
    } catch {
      toast.error("An error occurred while updating the shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/shipments/${shipment.id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Shipment</h1>
            <p className="text-sm text-muted-foreground">{shipment.reference}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Transport Mode</Label>
              <Select
                value={formData.transport_mode}
                onValueChange={(value) => handleChange("transport_mode", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="surface">Surface</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select
                value={formData.payment_mode}
                onValueChange={(value) => handleChange("payment_mode", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prepaid">Prepaid</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                  <SelectItem value="to_pay">To Pay</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pieces</Label>
              <Input
                type="number"
                min={1}
                value={formData.pieces}
                onChange={(e) => handleChange("pieces", parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                value={formData.weight_kg}
                onChange={(e) => handleChange("weight_kg", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Declared Value (₹)</Label>
              <Input
                type="number"
                min={0}
                value={formData.declared_value}
                onChange={(e) => handleChange("declared_value", parseFloat(e.target.value) || 0)}
              />
            </div>
            {formData.payment_mode === "cod" && (
              <div className="space-y-2">
                <Label>COD Amount (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.cod_amount}
                  onChange={(e) => handleChange("cod_amount", parseFloat(e.target.value) || 0)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warehouses */}
        <Card>
          <CardHeader>
            <CardTitle>Origin & Destination</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origin Warehouse</Label>
              <Select
                value={formData.origin_warehouse_id}
                onValueChange={(value) => handleChange("origin_warehouse_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.code} - {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Warehouse</Label>
              <Select
                value={formData.destination_warehouse_id}
                onValueChange={(value) => handleChange("destination_warehouse_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.code} - {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Consignee Details */}
        <Card>
          <CardHeader>
            <CardTitle>Consignee Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.consignee_name}
                onChange={(e) => handleChange("consignee_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <PhoneInput
                value={formData.consignee_phone}
                onChange={(digits) => handleChange("consignee_phone", digits)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.consignee_email}
                onChange={(e) => handleChange("consignee_email", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Textarea
                value={formData.consignee_address}
                onChange={(e) => handleChange("consignee_address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={formData.consignee_city}
                onChange={(e) => handleChange("consignee_city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                value={formData.consignee_state}
                onChange={(e) => handleChange("consignee_state", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input
                value={formData.consignee_pincode}
                onChange={(e) => handleChange("consignee_pincode", e.target.value)}
                maxLength={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                placeholder="Internal notes..."
              />
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={formData.special_instructions}
                onChange={(e) => handleChange("special_instructions", e.target.value)}
                rows={2}
                placeholder="Delivery instructions..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/shipments/${shipment.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
