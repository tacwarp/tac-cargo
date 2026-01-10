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
  Hash,
  Copy,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Loader2,
  Download,
  Printer,
  Info
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { AddressAutocomplete, type AddressData } from "./address-autocomplete";
import { AWBLabel, type AWBLabelData } from "./awb-label";
import { InvoiceDocument, type InvoiceDocumentData } from "./invoice-document";
import {
  generateInvoiceNumber,
  generateAWBNumber,
  generateConsignmentNumber,
} from "@/lib/invoice/id-generator";
import {
  calculateInvoice,
  calculateVolumetricWeight,
  formatCurrency,
  type InvoiceCalculation,
} from "@/lib/invoice/calculations";
import { createEnhancedInvoice } from "@/app/actions/invoice-enhanced";
import {
  generateInvoicePDF,
  generateAWBLabelPDF,
  downloadPDF,
} from "@/lib/invoice/pdf-generator";

// --- Types & Interfaces ---

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

// --- Initial Data ---

const initialPackage: PackageItem = {
  id: "pkg-1",
  category: "General",
  description: "",
  quantity: 1,
  weight: 1,
  length: 0,
  width: 0,
  height: 0,
  declaredValue: 0,
};

const initialFormData: FormData = {
  invoiceNo: "", // Generated on mount
  awbNo: "",     // Generated on mount
  consignmentNo: "",
  invoiceDate: new Date(),
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
    ratePerKg: 180,
    freightCharge: 0,
    pickupCharge: 100,
    deliveryCharge: 0,
    packingCharge: 50,
    insuranceCharge: 0,
    handlingCharge: 80,
    otherCharges: 0,
    advancePaid: 0,
    applyGST: true,
  },
  remarks: "",
  specialInstructions: "",
  termsAccepted: false,
};

interface InvoiceCreationFormProps {
  onSuccess?: (invoice: { invoice_no: string; awb_no: string }) => void;
  onCancel?: () => void;
}

export function InvoiceCreationForm({ onSuccess, onCancel }: InvoiceCreationFormProps = {}) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize IDs on mount
  useEffect(() => {
    setFormData(prev => {
        if(prev.invoiceNo) return prev;
        return {
            ...prev,
            invoiceNo: generateInvoiceNumber(),
            awbNo: generateAWBNumber(),
            consignmentNo: generateConsignmentNumber(1)
        }
    })
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

    // Dynamic rate adjustment based on mode if needed, for now using form data
    
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
      formData.consignee.address.state || "Manipur",
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
    (
      parent: "consignor" | "consignee" | "charges",
      field: string,
      value: unknown
    ) => {
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

    if (!formData.consignor.name) newErrors.consignorName = "Sender name required";
    if (!formData.consignor.phone) newErrors.consignorPhone = "Sender phone required";
    
    if (!formData.consignee.name) newErrors.consigneeName = "Receiver name required";
    if (!formData.consignee.phone) newErrors.consigneePhone = "Receiver phone required";
    if (!formData.consignee.address.city) newErrors.consigneeCity = "Destination city required";

    if (formData.packages.length === 0) newErrors.packages = "At least one package required";
    
    formData.packages.forEach((pkg, i) => {
      if (!pkg.description) newErrors[`pkg${i}Desc`] = "Description required";
      if (pkg.weight <= 0) newErrors[`pkg${i}Weight`] = "Invalid weight";
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
          phone: formData.consignor.phone,
          email: formData.consignor.email || undefined,
          gstin: formData.consignor.gstin || undefined,
          address: formData.consignor.address.address,
          city: formData.consignor.address.city,
          state: formData.consignor.address.state,
          pincode: formData.consignor.address.pincode,
        },
        consignee: {
          name: formData.consignee.name,
          phone: formData.consignee.phone,
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
        // In a real app, you might trigger PDF generation here or let the user do it
        // onDownloadInvoice(); 
        onSuccess?.({
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

  // PDF Generation helpers (reused logic)
  const buildInvoiceData = useCallback((): InvoiceDocumentData => {
    // ... same builder logic as before, mapped to current formData ...
    return {
      companyName: "TAPAN ASSOCIATE CARGO SERVICE",
      companyAddress: "1498, Gr. Floor, Wazir Nagar, Kotla-Mubarakpur, New Delhi-110003",
      companyPhone: "9711011416, 9999983936",
      companyGSTIN: "07AAMFT6165B1Z3",
      branchOffice: "Singjamei Thongam Leikai, Lane no. 6, Imphal West - 795008",
      branchPhone: "+913853570445, 6909383936",
      invoiceNo: formData.invoiceNo,
      consignmentNo: formData.consignmentNo,
      invoiceDate: formData.invoiceDate,
      awbNo: formData.awbNo,
      consignorName: formData.consignor.name,
      consignorAddress: formData.consignor.address.address,
      consignorCity: formData.consignor.address.city,
      consignorState: formData.consignor.address.state,
      consignorPincode: formData.consignor.address.pincode,
      consignorPhone: formData.consignor.phone,
      consignorGSTIN: formData.consignor.gstin,
      consigneeName: formData.consignee.name,
      consigneeAddress: formData.consignee.address.address,
      consigneeCity: formData.consignee.address.city,
      consigneeState: formData.consignee.address.state,
      consigneePincode: formData.consignee.address.pincode,
      consigneePhone: formData.consignee.phone,
      origin: formData.consignor.address.city || "Delhi",
      destination: formData.consignee.address.city || "Manipur",
      transportMode: formData.transportMode.toUpperCase(),
      pieces: formData.packages.reduce((sum, p) => sum + p.quantity, 0),
      actualWeight: calculation.actualWeight,
      chargeableWeight: calculation.chargeableWeight,
      ratePerKg: formData.charges.ratePerKg,
      declaredValue: formData.packages.reduce((sum, p) => sum + p.declaredValue, 0),
      freightCharge: calculation.charges.freightCharge,
      pickupCharge: calculation.charges.pickupCharge,
      packingCharge: calculation.charges.packingCharge,
      deliveryCharge: calculation.charges.deliveryCharge,
      insuranceCharge: calculation.charges.insuranceCharge,
      handlingCharge: calculation.charges.handlingCharge,
      otherCharges: calculation.charges.otherCharges,
      subtotal: calculation.tax.subtotal,
      cgst: calculation.tax.cgst,
      sgst: calculation.tax.sgst,
      igst: calculation.tax.igst,
      totalTax: calculation.tax.totalTax,
      grandTotal: calculation.tax.grandTotal,
      paymentMode: formData.paymentMode,
      advancePaid: calculation.advancePaid,
      balanceDue: calculation.balanceDue,
      remarks: formData.remarks,
    };
  }, [formData, calculation]);

  return (
    <div className="h-full w-full overflow-y-auto bg-muted/10">
      <div className="mx-auto w-full max-w-form p-section space-y-section pb-32">
        
        {/* 1. Authority Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 space-y-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create New Invoice</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter shipment details to generate invoice and label.
              </p>
            </div>
            <div className="flex gap-4 pt-2">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Transport Mode</Label>
                    <Select
                        value={formData.transportMode}
                        onValueChange={(v) => updateField("transportMode", v as FormData["transportMode"])}
                    >
                        <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="air">Air Freight</SelectItem>
                            <SelectItem value="surface">Surface Transport</SelectItem>
                            <SelectItem value="express">Express Delivery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Payment Mode</Label>
                    <Select
                        value={formData.paymentMode}
                        onValueChange={(v) => updateField("paymentMode", v as FormData["paymentMode"])}
                    >
                        <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PREPAID">Prepaid</SelectItem>
                            <SelectItem value="COD">Cash on Delivery</SelectItem>
                            <SelectItem value="TO PAY">To Pay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          <Card className="md:col-span-5 bg-card border-border shadow-sm">
            <CardContent className="p-5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Invoice No</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-mono font-bold text-primary">{formData.invoiceNo || "Generating..."}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(formData.invoiceNo, "Invoice No")}>
                            <Copy className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AWB / Tracking</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium">{formData.awbNo || "Generating..."}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(formData.awbNo, "AWB")}>
                            <Copy className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-between border-t pt-3 mt-1">
                    <div className="flex gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(formData.invoiceDate, "dd MMM yyyy, HH:mm")}</span>
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">Draft</Badge>
                </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 2. Parties Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8">
            {/* Consignor */}
            <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Consignor (Sender)
                    </h3>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">Search Customer</Button>
                </div>
                <Card className="border-border/50 shadow-none">
                    <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                            <Label>Name <span className="text-destructive">*</span></Label>
                            <Input 
                                value={formData.consignor.name}
                                onChange={(e) => updateNestedField("consignor", "name", e.target.value)}
                                placeholder="Sender Name"
                                className={cn(errors.consignorName && "border-destructive")}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone <span className="text-destructive">*</span></Label>
                                <Input 
                                    value={formData.consignor.phone}
                                    onChange={(e) => updateNestedField("consignor", "phone", e.target.value)}
                                    placeholder="+91"
                                    className={cn(errors.consignorPhone && "border-destructive")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>GSTIN</Label>
                                <Input 
                                    value={formData.consignor.gstin}
                                    onChange={(e) => updateNestedField("consignor", "gstin", e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <AddressAutocomplete 
                                label="Pickup Address"
                                value={formData.consignor.address}
                                onChange={(addr) => updateNestedField("consignor", "address", addr)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Consignee */}
            <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        Consignee (Receiver)
                    </h3>
                </div>
                <Card className="border-border/50 shadow-none">
                    <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                            <Label>Name <span className="text-destructive">*</span></Label>
                            <Input 
                                value={formData.consignee.name}
                                onChange={(e) => updateNestedField("consignee", "name", e.target.value)}
                                placeholder="Receiver Name"
                                className={cn(errors.consigneeName && "border-destructive")}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone <span className="text-destructive">*</span></Label>
                                <Input 
                                    value={formData.consignee.phone}
                                    onChange={(e) => updateNestedField("consignee", "phone", e.target.value)}
                                    placeholder="+91"
                                    className={cn(errors.consigneePhone && "border-destructive")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input 
                                    value={formData.consignee.email}
                                    onChange={(e) => updateNestedField("consignee", "email", e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <AddressAutocomplete 
                                label="Delivery Address"
                                required
                                value={formData.consignee.address}
                                onChange={(addr) => updateNestedField("consignee", "address", addr)}
                                errors={{ city: errors.consigneeCity }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* 3. Shipment & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 items-start">
            
            {/* Left Column: Packages & Charges Input */}
            <div className="md:col-span-7 space-y-8">
                {/* Packages */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Shipment Details
                        </h3>
                        <Button variant="outline" size="sm" onClick={addPackage} className="h-8 gap-2">
                            <Plus className="w-3 h-3" /> Add Package
                        </Button>
                    </div>
                    
                    {errors.packages && (
                        <div className="text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {errors.packages}
                        </div>
                    )}

                    <div className="space-y-3">
                        {formData.packages.map((pkg, index) => (
                            <Card key={pkg.id} className="relative group overflow-hidden border-border/60">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-12 gap-4">
                                        {/* Row 1: Description & Category */}
                                        <div className="col-span-8 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Description <span className="text-destructive">*</span></Label>
                                            <Input 
                                                value={pkg.description}
                                                onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                                                placeholder="Item contents..."
                                                className={cn("h-9", errors[`pkg${index}Desc`] && "border-destructive")}
                                            />
                                        </div>
                                        <div className="col-span-4 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Category</Label>
                                            <Select 
                                                value={pkg.category} 
                                                onValueChange={(v) => updatePackage(pkg.id, "category", v)}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Fragile">Fragile</SelectItem>
                                                    <SelectItem value="Perishable">Perishable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Row 2: Dims & Weight */}
                                        <div className="col-span-3 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Pieces</Label>
                                            <Input 
                                                type="number" 
                                                min={1}
                                                value={pkg.quantity}
                                                onChange={(e) => updatePackage(pkg.id, "quantity", parseInt(e.target.value) || 1)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-6 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Dims (LxWxH cm)</Label>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    placeholder="L" 
                                                    className="h-9 px-2 text-center" 
                                                    value={pkg.length || ""}
                                                    onChange={(e) => updatePackage(pkg.id, "length", parseFloat(e.target.value) || 0)}
                                                />
                                                <span className="text-muted-foreground">x</span>
                                                <Input 
                                                    placeholder="W" 
                                                    className="h-9 px-2 text-center"
                                                    value={pkg.width || ""}
                                                    onChange={(e) => updatePackage(pkg.id, "width", parseFloat(e.target.value) || 0)}
                                                />
                                                <span className="text-muted-foreground">x</span>
                                                <Input 
                                                    placeholder="H" 
                                                    className="h-9 px-2 text-center"
                                                    value={pkg.height || ""}
                                                    onChange={(e) => updatePackage(pkg.id, "height", parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Weight (kg) <span className="text-destructive">*</span></Label>
                                            <Input 
                                                type="number" 
                                                step="0.1"
                                                value={pkg.weight}
                                                onChange={(e) => updatePackage(pkg.id, "weight", parseFloat(e.target.value) || 0)}
                                                className={cn("h-9", errors[`pkg${index}Weight`] && "border-destructive")}
                                            />
                                        </div>
                                    </div>
                                    
                                    {formData.packages.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePackage(pkg.id)}
                                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <Separator />

                {/* Additional Charges Inputs */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Charges & Fees
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Rate per Kg (₹)</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.ratePerKg}
                                    onChange={(e) => updateNestedField("charges", "ratePerKg", parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pickup Charge</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.pickupCharge}
                                    onChange={(e) => updateNestedField("charges", "pickupCharge", parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Charge</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.deliveryCharge}
                                    onChange={(e) => updateNestedField("charges", "deliveryCharge", parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Packing Charge</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.packingCharge}
                                    onChange={(e) => updateNestedField("charges", "packingCharge", parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Handling / Other</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.handlingCharge}
                                    onChange={(e) => updateNestedField("charges", "handlingCharge", parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Advance Paid</Label>
                                <Input 
                                    type="number"
                                    value={formData.charges.advancePaid}
                                    onChange={(e) => updateNestedField("charges", "advancePaid", parseFloat(e.target.value) || 0)}
                                    className="border-primary/20 bg-primary/5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <Label>Internal Remarks</Label>
                        <Textarea 
                            placeholder="Operational notes (not visible to customer)"
                            className="mt-2"
                            value={formData.remarks}
                            onChange={(e) => updateField("remarks", e.target.value)}
                        />
                    </div>
                </section>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="md:col-span-5 sticky top-6">
                <Card className="bg-muted/30 border-muted shadow-sm max-w-summary w-full ml-auto">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-base">Charges Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Weight Logic Display */}
                        <div className="p-4 bg-background/50 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Actual Weight</span>
                                <span>{calculation.actualWeight} kg</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Volumetric Wt</span>
                                <span>{calculation.volumetricWeight} kg</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-medium text-foreground">
                                <span>Chargeable Weight</span>
                                <span>{calculation.chargeableWeight} kg</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                <span>Higher of Actual vs Volumetric applied</span>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Freight ({formatCurrency(formData.charges.ratePerKg)}/kg)</span>
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
                            
                            <Separator />
                            
                            <div className="flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span>{formatCurrency(calculation.tax.subtotal)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>GST ({calculation.tax.isInterState ? "IGST 18%" : "CGST+SGST 18%"})</span>
                                <span>{formatCurrency(calculation.tax.totalTax)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-end">
                                <span className="font-semibold text-lg">Total Payable</span>
                                <span className="font-bold text-xl text-primary">{formatCurrency(calculation.tax.grandTotal)}</span>
                            </div>

                            {calculation.advancePaid > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium pt-2">
                                    <span>Advance Paid</span>
                                    <span>- {formatCurrency(calculation.advancePaid)}</span>
                                </div>
                            )}
                            
                            {calculation.balanceDue > 0 && calculation.balanceDue !== calculation.tax.grandTotal && (
                                <div className="flex justify-between text-destructive font-bold pt-1">
                                    <span>Balance Due</span>
                                    <span>{formatCurrency(calculation.balanceDue)}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Terms and Actions */}
                <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-2">
                        <Checkbox 
                            id="terms" 
                            checked={formData.termsAccepted}
                            onCheckedChange={(c) => updateField("termsAccepted", !!c)}
                        />
                        <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                            I accept the terms of carriage and certify that the details provided are accurate.
                        </label>
                    </div>
                    {errors.terms && <p className="text-xs text-destructive ml-6">{errors.terms}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                            Save Draft
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px]">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" /> Generate Invoice
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
