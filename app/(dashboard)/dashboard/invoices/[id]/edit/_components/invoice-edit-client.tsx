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
import { updateInvoice } from "@/app/actions/invoice-crud";
import type { InvoiceStatus } from "@/types/database";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  weight: number;
  line_total: number;
}

interface InvoiceWithRelations {
  id: string;
  invoice_no: string;
  awb_no: string | null;
  type: string;
  status: InvoiceStatus;
  invoice_date: string;
  due_date: string | null;
  consignee_name: string | null;
  consignee_phone?: string;
  consignee_email?: string;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;
  payment_mode?: string;
  notes?: string;
  special_instructions?: string;
  subtotal: number;
  total_tax: number;
  total_amount: number;
  balance_due: number;
  customers?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
  } | null;
  invoice_items?: InvoiceItem[];
}

interface InvoiceEditClientProps {
  invoice: InvoiceWithRelations;
}

export function InvoiceEditClient({ invoice }: InvoiceEditClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    consignee_name: invoice.consignee_name || "",
    consignee_phone: invoice.consignee_phone || "",
    consignee_email: invoice.consignee_email || "",
    consignee_address: invoice.consignee_address || "",
    consignee_city: invoice.consignee_city || "",
    consignee_state: invoice.consignee_state || "",
    consignee_pincode: invoice.consignee_pincode || "",
    payment_mode: invoice.payment_mode || "prepaid",
    status: invoice.status,
    notes: invoice.notes || "",
    special_instructions: invoice.special_instructions || "",
    due_date: invoice.due_date || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateInvoice(invoice.id, formData);
      
      if (result.success) {
        toast.success("Invoice updated successfully");
        router.push(`/dashboard/invoices/${invoice.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update invoice");
      }
    } catch {
      toast.error("An error occurred while updating the invoice");
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
            <Link href={`/dashboard/invoices/${invoice.id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Invoice</h1>
            <p className="text-sm text-muted-foreground">
              {invoice.invoice_no} • AWB: {invoice.awb_no || "-"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial Payment</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="to_pay">To Pay</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
              />
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
              <Input
                value={formData.consignee_phone}
                onChange={(e) => handleChange("consignee_phone", e.target.value)}
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
                placeholder="Internal notes about this invoice..."
              />
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={formData.special_instructions}
                onChange={(e) => handleChange("special_instructions", e.target.value)}
                rows={2}
                placeholder="Special handling or delivery instructions..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono">₹{invoice.total_tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span className="font-mono">₹{invoice.total_amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span>Balance Due</span>
                <span className="font-mono">₹{invoice.balance_due.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/invoices/${invoice.id}`}>Cancel</Link>
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
