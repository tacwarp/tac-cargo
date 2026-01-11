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
import { updateCustomer } from "@/app/actions/customer-crud";
import { PhoneInput, getRawPhoneDigits } from "@/components/ui/phone-input";
import type { CustomerType } from "@/types/database";

interface CustomerData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  customer_type: CustomerType;
  credit_limit: number;
}

interface CustomerEditClientProps {
  customer: CustomerData;
}

export function CustomerEditClient({ customer }: CustomerEditClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: getRawPhoneDigits(customer.phone),
    address: customer.address || "",
    city: customer.city || "",
    state: customer.state || "",
    pincode: customer.pincode || "",
    gst_number: customer.gst_number || "",
    customer_type: customer.customer_type || "regular",
    credit_limit: customer.credit_limit || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateCustomer(customer.id, {
        ...formData,
        phone: `+91 ${formData.phone.slice(0, 5)} ${formData.phone.slice(5)}`,
      });
      
      if (result.success) {
        toast.success("Customer updated successfully");
        router.push(`/dashboard/customers/${customer.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update customer");
      }
    } catch {
      toast.error("An error occurred while updating the customer");
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
            <Link href={`/dashboard/customers/${customer.id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Customer</h1>
            <p className="text-sm text-muted-foreground">{customer.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <PhoneInput
                value={formData.phone}
                onChange={(digits) => handleChange("phone", digits)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input
                value={formData.gst_number}
                onChange={(e) => handleChange("gst_number", e.target.value)}
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select
                value={formData.customer_type}
                onValueChange={(value) => handleChange("customer_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Credit Limit (₹)</Label>
              <Input
                type="number"
                min={0}
                value={formData.credit_limit}
                onChange={(e) => handleChange("credit_limit", parseFloat(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/customers/${customer.id}`}>Cancel</Link>
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
