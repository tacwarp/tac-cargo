"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  CreditCard,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Download,
  Printer,
  Calculator,
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

// Form sections
const sections = [
  { id: 1, name: "Parties", icon: User, description: "Consignor & Consignee" },
  { id: 2, name: "Package", icon: Package, description: "Item Details" },
  { id: 3, name: "Payment", icon: CreditCard, description: "Charges & GST" },
  { id: 4, name: "Preview", icon: FileText, description: "Review & Generate" },
];

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
}

const initialPackage: PackageItem = {
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  weight: 1,
  length: 0,
  width: 0,
  height: 0,
  declaredValue: 0,
};

const initialFormData: FormData = {
  invoiceNo: generateInvoiceNumber(),
  awbNo: generateAWBNumber(),
  consignmentNo: generateConsignmentNumber(1),
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
  packages: [{ ...initialPackage }],
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
  },
  remarks: "",
  specialInstructions: "",
};

export function InvoiceCreationForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Calculate invoice totals
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
      formData.consignee.address.state || "Manipur",
      formData.transportMode,
      formData.charges.advancePaid,
      totalDeclaredValue
    );
  }, [formData.packages, formData.charges, formData.consignor.address.state, formData.consignee.address.state, formData.transportMode]);

  // Update field helper
  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Update nested field
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

  // Package management
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

  // Validation
  const validateSection = useCallback(
    (section: number): boolean => {
      const newErrors: Record<string, string> = {};

      if (section === 1) {
        if (!formData.consignor.name) newErrors.consignorName = "Required";
        if (!formData.consignor.phone) newErrors.consignorPhone = "Required";
        if (!formData.consignee.name) newErrors.consigneeName = "Required";
        if (!formData.consignee.phone) newErrors.consigneePhone = "Required";
        if (!formData.consignee.address.city) newErrors.consigneeCity = "Required";
      }

      if (section === 2) {
        if (formData.packages.length === 0) {
          newErrors.packages = "At least one package required";
        }
        formData.packages.forEach((pkg, i) => {
          if (!pkg.description) newErrors[`pkg${i}Desc`] = "Required";
          if (pkg.weight <= 0) newErrors[`pkg${i}Weight`] = "Invalid";
        });
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // Navigation
  const nextSection = useCallback(() => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 4));
    }
  }, [currentSection, validateSection]);

  const prevSection = useCallback(() => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  }, []);

  // Build data objects for components (declared before use)
  const buildInvoiceData = useCallback((): InvoiceDocumentData => {
    return {
      companyName: "TAPAN ASSOCIATE CARGO SERVICE",
      companyAddress: "1498, Gr. Floor, Wazir Nagar, Kotla-Mubarakpur, Gali No.3, New Delhi-110003",
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

  const buildLabelData = useCallback((): AWBLabelData => {
    return {
      awbNumber: formData.awbNo,
      shipDate: formData.invoiceDate,
      shipperName: formData.consignor.name || "TAPAN CARGO SERVICE",
      shipperAddress: formData.consignor.address.address,
      shipperCity: formData.consignor.address.city || "New Delhi",
      shipperState: formData.consignor.address.state || "Delhi",
      shipperPincode: formData.consignor.address.pincode || "110003",
      shipperPhone: formData.consignor.phone,
      shipperGSTIN: formData.consignor.gstin || "07AAMFT6165B1Z3",
      consigneeName: formData.consignee.name,
      consigneeAddress: formData.consignee.address.address,
      consigneeCity: formData.consignee.address.city,
      consigneeState: formData.consignee.address.state,
      consigneePincode: formData.consignee.address.pincode,
      consigneePhone: formData.consignee.phone,
      weight: calculation.chargeableWeight,
      volumetricWeight: calculation.volumetricWeight,
      pieces: formData.packages.reduce((sum, p) => sum + p.quantity, 0),
      transportMode: formData.transportMode.toUpperCase() as "AIR" | "SURFACE" | "EXPRESS",
      paymentMode: formData.paymentMode,
      contentDescription: formData.packages.map((p) => p.description).join(", "),
      specialInstructions: formData.specialInstructions,
      invoiceNo: formData.invoiceNo,
      invoiceDate: formData.invoiceDate,
      originStation: formData.consignor.address.city?.substring(0, 3).toUpperCase() || "DEL",
      destinationStation: formData.consignee.address.city?.substring(0, 4).toUpperCase() || "IMPL",
    };
  }, [formData, calculation]);

  // Generate PDFs (after buildInvoiceData and buildLabelData are declared)
  const handleDownloadInvoice = useCallback(() => {
    const invoiceData = buildInvoiceData();
    const pdf = generateInvoicePDF(invoiceData);
    downloadPDF(pdf, `Invoice-${formData.invoiceNo}.pdf`);
    toast.success("Invoice PDF downloaded!");
  }, [formData.invoiceNo, buildInvoiceData]);

  const handleDownloadLabel = useCallback(() => {
    const labelData = buildLabelData();
    const pdf = generateAWBLabelPDF(labelData);
    downloadPDF(pdf, `AWB-${formData.awbNo}.pdf`);
    toast.success("AWB Label downloaded!");
  }, [formData.awbNo, buildLabelData]);

  // Submit handler
  const handleSubmit = async () => {
    if (!validateSection(currentSection)) return;

    setIsSubmitting(true);
    try {
      // Build input for server action
      const input = {
        transportMode: formData.transportMode as "air" | "surface" | "express",
        paymentMode: formData.paymentMode as "PREPAID" | "COD" | "TO PAY",
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
          pickupCharge: formData.charges.pickupCharge || undefined,
          deliveryCharge: formData.charges.deliveryCharge || undefined,
          packingCharge: formData.charges.packingCharge || undefined,
          insuranceCharge: formData.charges.insuranceCharge || undefined,
          handlingCharge: formData.charges.handlingCharge || undefined,
          otherCharges: formData.charges.otherCharges || undefined,
          advancePaid: formData.charges.advancePaid || undefined,
        },
        remarks: formData.remarks || undefined,
        specialInstructions: formData.specialInstructions || undefined,
      };

      const result = await createEnhancedInvoice(input);

      if (result.success) {
        toast.success(`Invoice ${result.data.invoice_no} created successfully!`);
        // Download PDFs automatically
        handleDownloadInvoice();
        handleDownloadLabel();
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    } catch (err) {
      console.error("Invoice creation error:", err);
      toast.error("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section Indicator */}
      <div className="px-6 pt-4 pb-4 border-b border-border bg-muted/30">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isCompleted = currentSection > section.id;
              const isCurrent = currentSection === section.id;

              return (
                <li key={section.id} className="flex items-center">
                  <button
                    onClick={() => section.id < currentSection && setCurrentSection(section.id)}
                    className="flex flex-col items-center group"
                    disabled={section.id > currentSection}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isCompleted
                          ? "hsl(var(--primary))"
                          : isCurrent
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--muted))",
                        borderColor:
                          isCompleted || isCurrent
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isCompleted && "text-primary-foreground",
                        isCurrent && "text-primary",
                        !isCompleted && !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {section.name}
                    </span>
                  </button>
                  {index < sections.length - 1 && (
                    <div
                      className={cn(
                        "w-16 h-0.5 mx-2",
                        isCompleted ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentSection === 1 && (
              <Section1Parties
                formData={formData}
                errors={errors}
                updateNestedField={updateNestedField}
                updateField={updateField}
              />
            )}
            {currentSection === 2 && (
              <Section2Package
                formData={formData}
                errors={errors}
                calculation={calculation}
                updatePackage={updatePackage}
                addPackage={addPackage}
                removePackage={removePackage}
                updateField={updateField}
              />
            )}
            {currentSection === 3 && (
              <Section3Payment
                formData={formData}
                calculation={calculation}
                updateNestedField={updateNestedField}
              />
            )}
            {currentSection === 4 && (
              <Section4Preview
                formData={formData}
                calculation={calculation}
                invoiceData={buildInvoiceData()}
                labelData={buildLabelData()}
                onDownloadInvoice={handleDownloadInvoice}
                onDownloadLabel={handleDownloadLabel}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Calculation Summary */}
      {currentSection < 4 && (
        <div className="px-6 py-3 bg-muted/50 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Weight: <strong>{calculation.chargeableWeight} kg</strong>
              </span>
              <span className="text-muted-foreground">
                Pieces: <strong>{formData.packages.reduce((s, p) => s + p.quantity, 0)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Subtotal: <strong>{formatCurrency(calculation.tax.subtotal)}</strong>
              </span>
              <span className="text-muted-foreground">
                GST: <strong>{formatCurrency(calculation.tax.totalTax)}</strong>
              </span>
              <Badge variant="default" className="text-base px-3 py-1">
                Total: {formatCurrency(calculation.tax.grandTotal)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-border flex justify-between">
        <Button
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 1 || isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        {currentSection < 4 ? (
          <Button onClick={nextSection}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" onClick={handleDownloadLabel}>
              <Printer className="w-4 h-4 mr-2" />
              Print Label
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Section 1: Consignor & Consignee Details
function Section1Parties({
  formData,
  errors,
  updateNestedField,
  updateField,
}: {
  formData: FormData;
  errors: Record<string, string>;
  updateNestedField: (parent: "consignor" | "consignee", field: string, value: unknown) => void;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Consignor & Consignee Details</h3>
          <p className="text-sm text-muted-foreground">
            Enter shipper and receiver information
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="font-mono text-primary">{formData.invoiceNo}</div>
          <div className="text-muted-foreground">Invoice No.</div>
        </div>
      </div>

      {/* Transport & Payment Mode */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Transport Mode</Label>
          <Select
            value={formData.transportMode}
            onValueChange={(v) => updateField("transportMode", v as FormData["transportMode"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="air">Air Freight</SelectItem>
              <SelectItem value="surface">Surface Transport</SelectItem>
              <SelectItem value="express">Express Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Payment Mode</Label>
          <Select
            value={formData.paymentMode}
            onValueChange={(v) => updateField("paymentMode", v as FormData["paymentMode"])}
          >
            <SelectTrigger>
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

      <Separator />

      <div className="grid grid-cols-2 gap-6">
        {/* Consignor (Shipper) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Consignor (Shipper)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.consignor.name}
                onChange={(e) => updateNestedField("consignor", "name", e.target.value)}
                placeholder="Shipper name"
                className={cn(errors.consignorName && "border-destructive")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={formData.consignor.phone}
                  onChange={(e) => updateNestedField("consignor", "phone", e.target.value)}
                  placeholder="Phone number"
                  className={cn(errors.consignorPhone && "border-destructive")}
                />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={formData.consignor.gstin}
                  onChange={(e) => updateNestedField("consignor", "gstin", e.target.value)}
                  placeholder="GST Number"
                />
              </div>
            </div>
            <AddressAutocomplete
              value={formData.consignor.address}
              onChange={(addr) => updateNestedField("consignor", "address", addr)}
              label="Pickup Address"
            />
          </CardContent>
        </Card>

        {/* Consignee (Receiver) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Consignee (Receiver)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.consignee.name}
                onChange={(e) => updateNestedField("consignee", "name", e.target.value)}
                placeholder="Receiver name"
                className={cn(errors.consigneeName && "border-destructive")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={formData.consignee.phone}
                  onChange={(e) => updateNestedField("consignee", "phone", e.target.value)}
                  placeholder="Phone number"
                  className={cn(errors.consigneePhone && "border-destructive")}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.consignee.email}
                  onChange={(e) => updateNestedField("consignee", "email", e.target.value)}
                  placeholder="Email address"
                />
              </div>
            </div>
            <AddressAutocomplete
              value={formData.consignee.address}
              onChange={(addr) => updateNestedField("consignee", "address", addr)}
              label="Delivery Address"
              required
              errors={{
                city: errors.consigneeCity,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Section 2: Package Details
function Section2Package({
  formData,
  errors,
  calculation,
  updatePackage,
  addPackage,
  removePackage,
  updateField,
}: {
  formData: FormData;
  errors: Record<string, string>;
  calculation: InvoiceCalculation;
  updatePackage: (id: string, field: keyof PackageItem, value: unknown) => void;
  addPackage: () => void;
  removePackage: (id: string) => void;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Package Details</h3>
        <p className="text-sm text-muted-foreground">
          Add items and dimensions for volumetric calculation
        </p>
      </div>

      {/* Packages */}
      <div className="space-y-4">
        {formData.packages.map((pkg, index) => {
          const volWeight = pkg.length && pkg.width && pkg.height
            ? calculateVolumetricWeight(
                { length: pkg.length, width: pkg.width, height: pkg.height },
                formData.transportMode
              )
            : 0;

          return (
            <Card key={pkg.id}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Package #{index + 1}</CardTitle>
                {formData.packages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePackage(pkg.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Description *</Label>
                    <Input
                      value={pkg.description}
                      onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                      placeholder="Item description (e.g., FABRIC, ELECTRONICS)"
                      className={cn(errors[`pkg${index}Desc`] && "border-destructive")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={pkg.quantity}
                      onChange={(e) => updatePackage(pkg.id, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Weight (kg) *</Label>
                    <Input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={pkg.weight}
                      onChange={(e) => updatePackage(pkg.id, "weight", parseFloat(e.target.value) || 0)}
                      className={cn(errors[`pkg${index}Weight`] && "border-destructive")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Length (cm)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.length || ""}
                      onChange={(e) => updatePackage(pkg.id, "length", parseFloat(e.target.value) || 0)}
                      placeholder="L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (cm)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.width || ""}
                      onChange={(e) => updatePackage(pkg.id, "width", parseFloat(e.target.value) || 0)}
                      placeholder="W"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.height || ""}
                      onChange={(e) => updatePackage(pkg.id, "height", parseFloat(e.target.value) || 0)}
                      placeholder="H"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.declaredValue || ""}
                      onChange={(e) => updatePackage(pkg.id, "declaredValue", parseFloat(e.target.value) || 0)}
                      placeholder="Declared"
                    />
                  </div>
                </div>

                {/* Volumetric Weight Display */}
                {volWeight > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <Calculator className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Volumetric Weight:{" "}
                      <strong>{volWeight.toFixed(2)} kg</strong>
                      {volWeight > pkg.weight && (
                        <Badge variant="secondary" className="ml-2">
                          Chargeable
                        </Badge>
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button variant="outline" onClick={addPackage} className="w-full">
        + Add Another Package
      </Button>

      {/* Special Instructions */}
      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <Textarea
          value={formData.specialInstructions}
          onChange={(e) => updateField("specialInstructions", e.target.value)}
          placeholder="Fragile, Handle with care, etc."
          rows={2}
        />
      </div>

      {/* Weight Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{calculation.actualWeight} kg</div>
              <div className="text-xs text-muted-foreground">Actual Weight</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calculation.volumetricWeight} kg</div>
              <div className="text-xs text-muted-foreground">Volumetric Weight</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{calculation.chargeableWeight} kg</div>
              <div className="text-xs text-muted-foreground">Chargeable Weight</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Section 3: Payment & Charges
function Section3Payment({
  formData,
  calculation,
  updateNestedField,
}: {
  formData: FormData;
  calculation: InvoiceCalculation;
  updateNestedField: (parent: "charges", field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Payment & Charges</h3>
        <p className="text-sm text-muted-foreground">
          Configure rates and additional charges
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Charges Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Charge Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rate per Kg (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.ratePerKg}
                  onChange={(e) => updateNestedField("charges", "ratePerKg", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Pickup Charge (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.pickupCharge}
                  onChange={(e) => updateNestedField("charges", "pickupCharge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Packing Charge (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.packingCharge}
                  onChange={(e) => updateNestedField("charges", "packingCharge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Charge (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.deliveryCharge}
                  onChange={(e) => updateNestedField("charges", "deliveryCharge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Handling/Docket (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.handlingCharge}
                  onChange={(e) => updateNestedField("charges", "handlingCharge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Insurance (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.insuranceCharge}
                  onChange={(e) => updateNestedField("charges", "insuranceCharge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Other Charges (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.otherCharges}
                  onChange={(e) => updateNestedField("charges", "otherCharges", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Advance Paid (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.charges.advancePaid}
                  onChange={(e) => updateNestedField("charges", "advancePaid", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Freight ({calculation.chargeableWeight} kg × ₹{formData.charges.ratePerKg})</span>
                <span>{formatCurrency(calculation.charges.freightCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Charge</span>
                <span>{formatCurrency(calculation.charges.pickupCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Packing Charge</span>
                <span>{formatCurrency(calculation.charges.packingCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>{formatCurrency(calculation.charges.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Handling Charge</span>
                <span>{formatCurrency(calculation.charges.handlingCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance Charge</span>
                <span>{formatCurrency(calculation.charges.insuranceCharge)}</span>
              </div>
              {calculation.charges.otherCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Other Charges</span>
                  <span>{formatCurrency(calculation.charges.otherCharges)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(calculation.tax.subtotal)}</span>
            </div>

            <div className="space-y-1 text-sm">
              {calculation.tax.isInterState ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>IGST (18%)</span>
                  <span>{formatCurrency(calculation.tax.igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST (9%)</span>
                    <span>{formatCurrency(calculation.tax.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST (9%)</span>
                    <span>{formatCurrency(calculation.tax.sgst)}</span>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span className="text-primary">{formatCurrency(calculation.tax.grandTotal)}</span>
            </div>

            {calculation.advancePaid > 0 && (
              <>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Advance Paid</span>
                  <span>- {formatCurrency(calculation.advancePaid)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Balance Due</span>
                  <span>{formatCurrency(calculation.balanceDue)}</span>
                </div>
              </>
            )}

            <Badge
              variant={calculation.tax.isInterState ? "default" : "secondary"}
              className="mt-2"
            >
              {calculation.tax.isInterState ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Section 4: Preview
function Section4Preview({
  formData,
  calculation,
  invoiceData,
  labelData,
  onDownloadInvoice,
  onDownloadLabel,
}: {
  formData: FormData;
  calculation: InvoiceCalculation;
  invoiceData: InvoiceDocumentData;
  labelData: AWBLabelData;
  onDownloadInvoice: () => void;
  onDownloadLabel: () => void;
}) {
  const [previewMode, setPreviewMode] = useState<"invoice" | "label">("invoice");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Preview & Generate</h3>
          <p className="text-sm text-muted-foreground">
            Review and download your invoice and AWB label
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={previewMode === "invoice" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("invoice")}
          >
            Invoice
          </Button>
          <Button
            variant={previewMode === "label" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("label")}
          >
            AWB Label
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="border rounded-lg bg-white overflow-auto max-h-[60vh] p-4">
        {previewMode === "invoice" ? (
          <InvoiceDocument data={invoiceData} className="shadow-lg" />
        ) : (
          <AWBLabel data={labelData} showPrintButton={false} className="mx-auto" />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={onDownloadInvoice} className="h-12">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice PDF
        </Button>
        <Button variant="outline" onClick={onDownloadLabel} className="h-12">
          <Printer className="w-4 h-4 mr-2" />
          Download AWB Label
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold font-mono">{formData.invoiceNo}</div>
            <div className="text-xs text-muted-foreground">Invoice Number</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold font-mono">{formData.awbNo}</div>
            <div className="text-xs text-muted-foreground">AWB Number</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculation.tax.grandTotal)}
            </div>
            <div className="text-xs text-muted-foreground">Total Amount</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InvoiceCreationForm;
