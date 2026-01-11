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
import { updateManifest } from "@/app/actions/manifest-crud";

interface Warehouse {
  id: string;
  name: string;
  code: string;
}

interface ManifestWithRelations {
  id: string;
  manifest_number: string;
  status: string;
  transport_mode: string | null;
  vehicle_number: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  seal_number: string | null;
  planned_departure: string | null;
  planned_arrival: string | null;
  notes: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
}

interface ManifestEditClientProps {
  manifest: ManifestWithRelations;
  warehouses: Warehouse[];
}

export function ManifestEditClient({ manifest, warehouses }: ManifestEditClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    transport_mode: manifest.transport_mode || "air",
    vehicle_number: manifest.vehicle_number || "",
    driver_name: manifest.driver_name || "",
    driver_phone: manifest.driver_phone || "",
    seal_number: manifest.seal_number || "",
    planned_departure: manifest.planned_departure || "",
    planned_arrival: manifest.planned_arrival || "",
    notes: manifest.notes || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateManifest(manifest.id, formData);
      
      if (result.success) {
        toast.success("Manifest updated successfully");
        router.push(`/dashboard/manifests/${manifest.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update manifest");
      }
    } catch {
      toast.error("An error occurred while updating the manifest");
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
            <Link href={`/dashboard/manifests/${manifest.id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Manifest</h1>
            <p className="text-sm text-muted-foreground">{manifest.manifest_number}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transport Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transport Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vehicle Number</Label>
              <Input
                value={formData.vehicle_number}
                onChange={(e) => handleChange("vehicle_number", e.target.value)}
                placeholder="e.g., DL-01-AB-1234"
              />
            </div>
            <div className="space-y-2">
              <Label>Driver Name</Label>
              <Input
                value={formData.driver_name}
                onChange={(e) => handleChange("driver_name", e.target.value)}
                placeholder="Driver's full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Driver Phone</Label>
              <Input
                value={formData.driver_phone}
                onChange={(e) => handleChange("driver_phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label>Seal Number</Label>
              <Input
                value={formData.seal_number}
                onChange={(e) => handleChange("seal_number", e.target.value)}
                placeholder="Security seal number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Planned Departure</Label>
              <Input
                type="datetime-local"
                value={formData.planned_departure ? new Date(formData.planned_departure).toISOString().slice(0, 16) : ""}
                onChange={(e) => handleChange("planned_departure", e.target.value ? new Date(e.target.value).toISOString() : "")}
              />
            </div>
            <div className="space-y-2">
              <Label>Planned Arrival</Label>
              <Input
                type="datetime-local"
                value={formData.planned_arrival ? new Date(formData.planned_arrival).toISOString().slice(0, 16) : ""}
                onChange={(e) => handleChange("planned_arrival", e.target.value ? new Date(e.target.value).toISOString() : "")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                placeholder="Internal notes and instructions..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/manifests/${manifest.id}`}>Cancel</Link>
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
