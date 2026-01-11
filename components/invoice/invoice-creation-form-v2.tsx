"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { format } from "date-fns";
import {
  User,
  Package,
  CreditCard,
  FileText,
  Truck,
  Calendar,
  Copy,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Info,
  Mail,
  Building2,
  Scale,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneInput, getFullPhoneNumber } from "@/components/ui/phone-input";
import { AddressAutocomplete } from "@/components/invoice/address-autocomplete";

import {
  generateInvoiceNumber,
  generateAWBNumber,
  generateConsignmentNumber,
} from "@/lib/invoice/id-generator";
import {
  calculateInvoice,
  formatCurrency,
  type InvoiceCalculation,
} from "@/lib/invoice/calculations";
import { createEnhancedInvoice } from "@/app/actions/invoice-enhanced";

// --- Types ---

interface AddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ConsignorData {
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: AddressData;
}

interface ConsigneeData {
  name: string;
  phone: string;
  email: string;
  address: AddressData;
}

interface PackageItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
}

interface ChargesData {
  ratePerKg: number;
  freightCharge: number;
  pickupCharge: number;
  deliveryCharge: number;
  packingCharge: number;
  insuranceCharge: number;
  handlingCharge: number;
  otherCharges: number;
  advancePaid: number;
  applyGST: boolean;
}

interface FormData {
  invoiceNo: string;
  awbNo: string;
  consignmentNo: string;
  invoiceDate: Date;
  transportMode: "air" | "surface" | "express";
  paymentMode: "PREPAID" | "COD" | "TO PAY";
  consignor: ConsignorData;
  consignee: ConsigneeData;
  packages: PackageItem[];
  charges: ChargesData;
  remarks: string;
  specialInstructions: string;
  termsAccepted: boolean;
}

// --- Initial Data (ALL VALUES SET TO ZERO) ---

const initialPackage: PackageItem = {
  id: "pkg-1",
  category: "General",
  description: "",
  quantity: 1,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  declaredValue: 0,
};

// Use a function to create initial data to avoid hydration mismatches
const createInitialFormData = (): FormData => ({
  invoiceNo: "",
  awbNo: "",
  consignmentNo: "",
  invoiceDate: null as unknown as Date, // Will be set client-side
  transportMode: "air",
  paymentMode: "PREPAID",
  consignor: {
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: { address: "", city: "", state: "", pincode: "" },
  },
  consignee: {
    name: "",
    phone: "",
    email: "",
    address: { address: "", city: "", state: "", pincode: "" },
  },
  packages: [{ ...initialPackage, id: "pkg-init" }],
  charges: {
    ratePerKg: 0,
    freightCharge: 0,
    pickupCharge: 0,
    deliveryCharge: 0,
    packingCharge: 0,
    insuranceCharge: 0,
    handlingCharge: 0,
    otherCharges: 0,
    advancePaid: 0,
    applyGST: true,
  },
  remarks: "",
  specialInstructions: "",
  termsAccepted: false,
});

// Indian States for dropdown - Priority states (Manipur, Delhi) at top for easy selection
const PRIORITY_STATES = ["Manipur", "Delhi"];
const OTHER_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
];
// INDIAN_STATES used by AddressAutocomplete component internally
const _INDIAN_STATES = [...PRIORITY_STATES, ...OTHER_STATES];
void _INDIAN_STATES; // Suppress unused warning - available for future use

interface InvoiceCreationFormV2Props {
  onSuccess?: (invoice: { id: string; invoice_no: string; awb_no: string }) => void;
  onCancel?: () => void;
}


// --- Form Field Component (MUST be outside main component to prevent remounts) ---
const FormField = ({ 
  label, 
  required, 
  error, 
  children, 
  className,
  hint
}: { 
  label: string; 
  required?: boolean; 
  error?: string; 
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    {children}
    {hint && !error && (
      <p className="text-xs text-muted-foreground">{hint}</p>
    )}
    {error && (
      <p className="text-xs text-destructive flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

export function InvoiceCreationFormV2({ onSuccess, onCancel }: InvoiceCreationFormV2Props) {
  const [formData, setFormData] = useState<FormData>(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize dynamic values ONLY on client after hydration
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoiceNo: generateInvoiceNumber(),
      awbNo: generateAWBNumber(),
      consignmentNo: generateConsignmentNumber(),
      invoiceDate: new Date(),
    }));
  }, []);

  // --- Calculations ---
  const calculation = useMemo<InvoiceCalculation>(() => {
    const packages = formData.packages.map((pkg) => ({
      actualWeight: pkg.weight * pkg.quantity,
      dimensions: pkg.length && pkg.width && pkg.height
        ? { length: pkg.length, width: pkg.width, height: pkg.height }
        : undefined,
      quantity: pkg.quantity,
    }));

    const totalDeclaredValue = formData.packages.reduce(
      (sum, pkg) => sum + pkg.declaredValue * pkg.quantity,
      0
    );

    return calculateInvoice(
      packages,
      {
        pickupCharge: formData.charges.pickupCharge,
        deliveryCharge: formData.charges.deliveryCharge,
        packingCharge: formData.charges.packingCharge,
        handlingCharge: formData.charges.handlingCharge,
        otherCharges: formData.charges.otherCharges,
      },
      formData.charges.ratePerKg,
      formData.consignor.address.state || "Delhi",
      formData.consignee.address.state || "Delhi",
      formData.transportMode,
      formData.charges.advancePaid,
      totalDeclaredValue
    );
  }, [formData.packages, formData.charges, formData.consignor.address.state, formData.consignee.address.state, formData.transportMode]);

  // --- Helpers ---
  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [errors]
  );

  const updateNestedField = useCallback(
    (parent: "consignor" | "consignee" | "charges", field: string, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value },
      }));
    },
    []
  );


  const addPackage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, { ...initialPackage, id: crypto.randomUUID() }],
    }));
  }, []);

  const removePackage = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id),
    }));
  }, []);

  const updatePackage = useCallback(
    (id: string, field: keyof PackageItem, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      }));
    },
    []
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // --- Validation ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Consignor validation
    if (!formData.consignor.name?.trim()) newErrors.consignorName = "Sender name required";
    if (!formData.consignor.phone) {
      newErrors.consignorPhone = "Sender phone required";
    } else if (formData.consignor.phone.replace(/\D/g, "").length < 7) {
      newErrors.consignorPhone = "Phone must be at least 7 digits";
    }
    if (!formData.consignor.address.city?.trim()) newErrors.consignorCity = "Sender city required";
    if (!formData.consignor.address.state?.trim()) newErrors.consignorState = "Sender state required";
    
    // Consignee validation
    if (!formData.consignee.name?.trim()) newErrors.consigneeName = "Receiver name required";
    if (!formData.consignee.phone) {
      newErrors.consigneePhone = "Receiver phone required";
    } else if (formData.consignee.phone.replace(/\D/g, "").length < 7) {
      newErrors.consigneePhone = "Phone must be at least 7 digits";
    }
    if (!formData.consignee.address.city?.trim()) newErrors.consigneeCity = "Destination city required";
    if (!formData.consignee.address.state?.trim()) newErrors.consigneeState = "Destination state required";
    if (!formData.consignee.address.pincode?.trim()) newErrors.consigneePincode = "Destination pincode required";

    // Package validation
    if (formData.packages.length === 0) newErrors.packages = "At least one package required";
    
    formData.packages.forEach((pkg, i) => {
      if (!pkg.description?.trim()) newErrors[`pkg${i}Desc`] = "Description required";
      if (pkg.weight <= 0) newErrors[`pkg${i}Weight`] = "Weight must be greater than 0";
    });

    if (!formData.termsAccepted) newErrors.terms = "You must accept the terms";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the errors in the form");
      return false;
    }
    return true;
  };

  // --- Submission ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const input = {
        transportMode: formData.transportMode,
        paymentMode: formData.paymentMode,
        consignor: {
          name: formData.consignor.name,
          phone: getFullPhoneNumber(formData.consignor.phone),
          email: formData.consignor.email || undefined,
          gstin: formData.consignor.gstin || undefined,
          address: formData.consignor.address.address,
          city: formData.consignor.address.city,
          state: formData.consignor.address.state,
          pincode: formData.consignor.address.pincode,
        },
        consignee: {
          name: formData.consignee.name,
          phone: getFullPhoneNumber(formData.consignee.phone),
          email: formData.consignee.email || undefined,
          address: formData.consignee.address.address,
          city: formData.consignee.address.city,
          state: formData.consignee.address.state,
          pincode: formData.consignee.address.pincode,
        },
        packages: formData.packages.map((pkg) => ({
          description: pkg.description,
          quantity: pkg.quantity,
          weight: pkg.weight,
          length: pkg.length || undefined,
          width: pkg.width || undefined,
          height: pkg.height || undefined,
          declaredValue: pkg.declaredValue || undefined,
        })),
        charges: {
          ratePerKg: formData.charges.ratePerKg,
          pickupCharge: formData.charges.pickupCharge,
          deliveryCharge: formData.charges.deliveryCharge,
          packingCharge: formData.charges.packingCharge,
          insuranceCharge: formData.charges.insuranceCharge,
          handlingCharge: formData.charges.handlingCharge,
          otherCharges: formData.charges.otherCharges,
          advancePaid: formData.charges.advancePaid,
        },
        remarks: formData.remarks,
        specialInstructions: formData.specialInstructions,
      };

      const result = await createEnhancedInvoice(input);

      if (result.success) {
        toast.success(`Invoice ${result.data.invoice_no} created!`);
        onSuccess?.({
          id: result.data.id,
          invoice_no: result.data.invoice_no,
          awb_no: result.data.awb_no,
        });
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    } catch (err) {
      console.error("Invoice creation error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="px-8 py-8 space-y-10">
        {/* ============================================= */}
        {/* HEADER SECTION */}
        {/* ============================================= */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left: Title & Mode Selection */}
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Create New Invoice</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a comprehensive invoice with automated calculations
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <FormField label="Transport Mode" className="min-w-[180px]">
                <Select
                  value={formData.transportMode}
                  onValueChange={(v) => updateField("transportMode", v as FormData["transportMode"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">
                      <span className="flex items-center gap-2">✈️ Air Freight</span>
                    </SelectItem>
                    <SelectItem value="surface">
                      <span className="flex items-center gap-2">🚚 Surface Transport</span>
                    </SelectItem>
                    <SelectItem value="express">
                      <span className="flex items-center gap-2">⚡ Express Delivery</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Payment Mode" className="min-w-[180px]">
                <Select
                  value={formData.paymentMode}
                  onValueChange={(v) => updateField("paymentMode", v as FormData["paymentMode"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                    <SelectItem value="TO PAY">To Pay</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Right: Invoice Details Card */}
          <Card className="w-full lg:w-[340px] bg-muted/30 border-muted">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Invoice No</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-mono font-bold text-primary">
                      {formData.invoiceNo || "..."}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => copyToClipboard(formData.invoiceNo, "Invoice No")}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy Invoice No</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AWB / Tracking</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-medium truncate">
                      {formData.awbNo || "..."}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => copyToClipboard(formData.awbNo, "AWB")}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy AWB</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formData.invoiceDate ? format(formData.invoiceDate, "dd MMM yyyy, HH:mm") : "Loading..."}</span>
                </div>
                <Badge variant="outline" className="text-xs">Draft</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ============================================= */}
        {/* PARTIES SECTION - CONSIGNOR & CONSIGNEE */}
        {/* ============================================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Consignor (Sender) */}
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/10">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                Consignor (Sender)
                <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs">
                  Search Customer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <FormField label="Full Name" required error={errors.consignorName}>
                <Input
                  value={formData.consignor.name}
                  onChange={(e) => updateNestedField("consignor", "name", e.target.value)}
                  placeholder="Enter sender's full name"
                  className={cn(errors.consignorName && "border-destructive")}
                />
              </FormField>

              {/* Phone & GSTIN Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone Number" required error={errors.consignorPhone}>
                  <PhoneInput
                    value={formData.consignor.phone}
                    onChange={(digits) => updateNestedField("consignor", "phone", digits)}
                    error={!!errors.consignorPhone}
                  />
                </FormField>
                <FormField label="GSTIN" hint="Optional for GST invoicing">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={formData.consignor.gstin}
                      onChange={(e) => updateNestedField("consignor", "gstin", e.target.value.toUpperCase())}
                      placeholder="22AAAAA0000A1Z5"
                      className="pl-10 uppercase"
                      maxLength={15}
                    />
                  </div>
                </FormField>
              </div>

              {/* Address Section */}
              <AddressAutocomplete
                label="Pickup Address"
                value={formData.consignor.address}
                onChange={(addr) => {
                  setFormData(prev => ({
                    ...prev,
                    consignor: { ...prev.consignor, address: addr }
                  }));
                }}
              />
            </CardContent>
          </Card>

          {/* Consignee (Receiver) */}
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-500/10">
                  <Truck className="w-4 h-4 text-emerald-500" />
                </div>
                Consignee (Receiver)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <FormField label="Full Name" required error={errors.consigneeName}>
                <Input
                  value={formData.consignee.name}
                  onChange={(e) => updateNestedField("consignee", "name", e.target.value)}
                  placeholder="Enter receiver's full name"
                  className={cn(errors.consigneeName && "border-destructive")}
                />
              </FormField>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone Number" required error={errors.consigneePhone}>
                  <PhoneInput
                    value={formData.consignee.phone}
                    onChange={(digits) => updateNestedField("consignee", "phone", digits)}
                    error={!!errors.consigneePhone}
                  />
                </FormField>
                <FormField label="Email" hint="For delivery updates">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.consignee.email}
                      onChange={(e) => updateNestedField("consignee", "email", e.target.value)}
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                  </div>
                </FormField>
              </div>

              {/* Address Section */}
              <AddressAutocomplete
                label="Delivery Address"
                required
                value={formData.consignee.address}
                onChange={(addr) => {
                  setFormData(prev => ({
                    ...prev,
                    consignee: { ...prev.consignee, address: addr }
                  }));
                }}
                errors={{ city: errors.consigneeCity }}
              />
            </CardContent>
          </Card>
        </div>

        {/* ============================================= */}
        {/* SHIPMENT & CHARGES SECTION */}
        {/* ============================================= */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Packages & Charges (2 columns) */}
          <div className="xl:col-span-2 space-y-8">
            {/* Packages */}
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-orange-500/10">
                      <Package className="w-4 h-4 text-orange-500" />
                    </div>
                    Shipment Details
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={addPackage} className="h-8 gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.packages && (
                  <div className="text-sm text-destructive flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.packages}
                  </div>
                )}

                {formData.packages.map((pkg, index) => (
                  <Card key={pkg.id} className="relative group border-dashed hover:border-solid transition-all">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Description - Full Width */}
                        <div className="col-span-12 sm:col-span-8">
                          <FormField 
                            label="Package Description" 
                            required 
                            error={errors[`pkg${index}Desc`]}
                          >
                            <Input
                              value={pkg.description}
                              onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                              placeholder="What's inside? (e.g., Electronics, Documents, Clothing)"
                              className={cn(errors[`pkg${index}Desc`] && "border-destructive")}
                            />
                          </FormField>
                        </div>

                        {/* Category */}
                        <div className="col-span-12 sm:col-span-4">
                          <FormField label="Category">
                            <Select
                              value={pkg.category}
                              onValueChange={(v) => updatePackage(pkg.id, "category", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Fragile">Fragile</SelectItem>
                                <SelectItem value="Perishable">Perishable</SelectItem>
                                <SelectItem value="Documents">Documents</SelectItem>
                                <SelectItem value="Clothing">Clothing</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormField>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-6 sm:col-span-2">
                          <FormField label="Qty">
                            <Input
                              type="number"
                              min={1}
                              value={pkg.quantity}
                              onChange={(e) => updatePackage(pkg.id, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </FormField>
                        </div>

                        {/* Weight */}
                        <div className="col-span-6 sm:col-span-2">
                          <FormField 
                            label="Weight (kg)" 
                            required 
                            error={errors[`pkg${index}Weight`]}
                          >
                            <div className="relative">
                              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.1"
                                min={0}
                                value={pkg.weight || ""}
                                onChange={(e) => updatePackage(pkg.id, "weight", parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                                className={cn("pl-10", errors[`pkg${index}Weight`] && "border-destructive")}
                              />
                            </div>
                          </FormField>
                        </div>

                        {/* Dimensions */}
                        <div className="col-span-12 sm:col-span-5">
                          <FormField label="Dimensions (L × W × H cm)" hint="For volumetric weight">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="L"
                                value={pkg.length || ""}
                                onChange={(e) => updatePackage(pkg.id, "length", parseFloat(e.target.value) || 0)}
                                className="text-center"
                              />
                              <span className="text-muted-foreground">×</span>
                              <Input
                                type="number"
                                placeholder="W"
                                value={pkg.width || ""}
                                onChange={(e) => updatePackage(pkg.id, "width", parseFloat(e.target.value) || 0)}
                                className="text-center"
                              />
                              <span className="text-muted-foreground">×</span>
                              <Input
                                type="number"
                                placeholder="H"
                                value={pkg.height || ""}
                                onChange={(e) => updatePackage(pkg.id, "height", parseFloat(e.target.value) || 0)}
                                className="text-center"
                              />
                            </div>
                          </FormField>
                        </div>

                        {/* Declared Value */}
                        <div className="col-span-12 sm:col-span-3">
                          <FormField label="Declared Value (₹)" hint="For insurance">
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min={0}
                                value={pkg.declaredValue || ""}
                                onChange={(e) => updatePackage(pkg.id, "declaredValue", parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="pl-10"
                              />
                            </div>
                          </FormField>
                        </div>
                      </div>

                      {/* Delete Button */}
                      {formData.packages.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePackage(pkg.id)}
                          className="absolute top-3 right-3 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Charges */}
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-500/10">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                  </div>
                  Charges & Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <FormField label="Rate per Kg (₹)">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.ratePerKg || ""}
                      onChange={(e) => updateNestedField("charges", "ratePerKg", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Pickup Charge">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.pickupCharge || ""}
                      onChange={(e) => updateNestedField("charges", "pickupCharge", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Delivery Charge">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.deliveryCharge || ""}
                      onChange={(e) => updateNestedField("charges", "deliveryCharge", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Packing Charge">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.packingCharge || ""}
                      onChange={(e) => updateNestedField("charges", "packingCharge", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Handling Charge">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.handlingCharge || ""}
                      onChange={(e) => updateNestedField("charges", "handlingCharge", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Insurance">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.insuranceCharge || ""}
                      onChange={(e) => updateNestedField("charges", "insuranceCharge", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Other Charges">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.otherCharges || ""}
                      onChange={(e) => updateNestedField("charges", "otherCharges", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Advance Paid">
                    <Input
                      type="number"
                      min={0}
                      value={formData.charges.advancePaid || ""}
                      onChange={(e) => updateNestedField("charges", "advancePaid", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="border-emerald-500/30 bg-emerald-500/5"
                    />
                  </FormField>
                </div>

                <FormField label="Internal Remarks" hint="Not visible to customer">
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => updateField("remarks", e.target.value)}
                    placeholder="Add any operational notes..."
                    className="min-h-[80px]"
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary (1 column) */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Summary Card */}
              <Card className="bg-gradient-to-b from-muted/50 to-muted/20 border-muted">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">Charges Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Weight Summary */}
                  <div className="p-4 space-y-2.5 text-sm border-b bg-background/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actual Weight</span>
                      <span className="font-medium">{calculation.actualWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volumetric Weight</span>
                      <span className="font-medium">{calculation.volumetricWeight} kg</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Chargeable Weight</span>
                      <span className="text-primary">{calculation.chargeableWeight} kg</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                      <Info className="w-3 h-3" />
                      Higher of actual vs volumetric
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Freight ({formatCurrency(formData.charges.ratePerKg)}/kg)
                      </span>
                      <span>{formatCurrency(calculation.charges.freightCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup & Delivery</span>
                      <span>{formatCurrency(calculation.charges.pickupCharge + calculation.charges.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packing & Handling</span>
                      <span>{formatCurrency(calculation.charges.packingCharge + calculation.charges.handlingCharge)}</span>
                    </div>
                    {calculation.charges.insuranceCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insurance</span>
                        <span>{formatCurrency(calculation.charges.insuranceCharge)}</span>
                      </div>
                    )}

                    <Separator className="my-3" />

                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculation.tax.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        GST ({calculation.tax.isInterState ? "IGST 18%" : "CGST+SGST 18%"})
                      </span>
                      <span>{formatCurrency(calculation.tax.totalTax)}</span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-base">Total Payable</span>
                      <span className="font-bold text-xl text-primary">
                        {formatCurrency(calculation.tax.grandTotal)}
                      </span>
                    </div>

                    {calculation.advancePaid > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium pt-2">
                        <span>Advance Paid</span>
                        <span>- {formatCurrency(calculation.advancePaid)}</span>
                      </div>
                    )}

                    {calculation.balanceDue > 0 && calculation.balanceDue !== calculation.tax.grandTotal && (
                      <div className="flex justify-between text-orange-600 font-bold pt-1 text-base">
                        <span>Balance Due</span>
                        <span>{formatCurrency(calculation.balanceDue)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Terms & Actions */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(c) => updateField("termsAccepted", !!c)}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    I accept the terms of carriage and certify that the details provided are accurate and complete.
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.terms}
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-11"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Invoice
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
