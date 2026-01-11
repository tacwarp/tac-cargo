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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { AddressAutocomplete, type AddressData } from "./address-autocomplete";
import { InvoicePrintView } from "./invoice-print-view";
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
// Removed unused PDF generation helpers

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
            if (prev.invoiceNo) return prev;
            return {
                ...prev,
                invoiceNo: generateInvoiceNumber(),
                awbNo: generateAWBNumber(),
                consignmentNo: generateConsignmentNumber()
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

    const clonePackage = useCallback((id: string) => {
        setFormData((prev) => {
            const pkgToClone = prev.packages.find((p) => p.id === id);
            if (!pkgToClone) return prev;
            return {
                ...prev,
                packages: [...prev.packages, { ...pkgToClone, id: crypto.randomUUID() }],
            };
        });
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

    return (
        <div className="h-full w-full overflow-y-auto bg-muted/10">
            <div className="mx-auto w-full max-w-form p-section space-y-section pb-32">

                {/* 1. Authority Header */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-8">
                    <div className="md:col-span-12 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic drop-shadow-sm">Shipment Console</h1>
                                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] ml-1">
                                    TAC Logistics Enterprise / Document Generation
                                </p>
                            </div>
                            <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm">
                                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-8 bg-background shadow-sm">Form</Button>
                                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-8 opacity-40">Preview</Button>
                                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-8 opacity-40">Security</Button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-border/40">
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

                    <Card className="md:col-span-12 bg-card border-2 border-primary/5 rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden group transition-all hover:border-primary/10">
                        <CardContent className="p-8 grid grid-cols-4 gap-8">
                            <div className="space-y-1.5 border-r border-border/40">
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Authority ID</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black font-mono text-primary tracking-tighter">{formData.invoiceNo || "..."}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(formData.invoiceNo, "Invoice")}>
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-1.5 border-r border-border/40">
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Tracking Bridge</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black font-mono text-slate-500">{formData.awbNo || "..."}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(formData.awbNo, "AWB")}>
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-1.5 border-r border-border/40">
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Chronology</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-slate-800">{format(formData.invoiceDate, "dd MMM yyyy")}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pl-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Protocol Status</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="px-3 py-1 bg-blue-500/5 text-blue-600 border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">Awaiting Finalization</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* 2. Parties Section */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8">
                    {/* Consignor */}
                    <div className="md:col-span-6 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-0.5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    Origin Protocol
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Consignor Details</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary">Bridge CRM</Button>
                        </div>
                        <Card className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:border-blue-500/20">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Identity</Label>
                                    <Input
                                        value={formData.consignor.name}
                                        onChange={(e) => updateNestedField("consignor", "name", e.target.value)}
                                        placeholder="Full Name / Legal Name"
                                        className={cn("h-12 rounded-2xl bg-slate-50 border-slate-100 font-black text-slate-700 focus:bg-white focus:border-blue-500 transition-all", errors.consignorName && "border-destructive")}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Contact</Label>
                                        <Input
                                            value={formData.consignor.phone}
                                            onChange={(e) => updateNestedField("consignor", "phone", e.target.value)}
                                            placeholder="+91"
                                            className={cn("h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold", errors.consignorPhone && "border-destructive")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tax Fingerprint (GST)</Label>
                                        <Input
                                            value={formData.consignor.gstin}
                                            onChange={(e) => updateNestedField("consignor", "gstin", e.target.value)}
                                            placeholder="Optional"
                                            className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold uppercase"
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
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-0.5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                    <Truck className="w-3 h-3" />
                                    Destination Protocol
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Consignee Details</p>
                            </div>
                        </div>
                        <Card className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:border-blue-500/20">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Identity</Label>
                                    <Input
                                        value={formData.consignee.name}
                                        onChange={(e) => updateNestedField("consignee", "name", e.target.value)}
                                        placeholder="Receiver Name"
                                        className={cn("h-12 rounded-2xl bg-slate-50 border-slate-100 font-black text-slate-700 focus:bg-white focus:border-blue-500 transition-all", errors.consigneeName && "border-destructive")}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Contact</Label>
                                        <Input
                                            value={formData.consignee.phone}
                                            onChange={(e) => updateNestedField("consignee", "phone", e.target.value)}
                                            placeholder="+91"
                                            className={cn("h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold", errors.consigneePhone && "border-destructive")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Notification (Email)</Label>
                                        <Input
                                            value={formData.consignee.email}
                                            onChange={(e) => updateNestedField("consignee", "email", e.target.value)}
                                            placeholder="Optional"
                                            className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold"
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
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-0.5">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                        <Package className="w-3 h-3" />
                                        Cargo Inventory
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Itemized Shipment Details</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={addPackage} className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary gap-2">
                                    <Plus className="w-3 h-3" /> Add Unit
                                </Button>
                            </div>

                            {errors.packages && (
                                <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-[11px] font-black uppercase tracking-tight text-destructive flex items-center gap-2 mx-2">
                                    <AlertCircle className="w-4 h-4" /> {errors.packages}
                                </div>
                            )}

                            <div className="space-y-3">
                                {formData.packages.map((pkg, index) => (
                                    <Card key={pkg.id} className="relative group overflow-hidden border-2 border-slate-100 rounded-[2rem] shadow-lg shadow-slate-200/30 transition-all hover:border-blue-500/10">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-12 gap-6">
                                                {/* Header Row */}
                                                <div className="col-span-12 flex items-center justify-between mb-2">
                                                    <Badge variant="ghost" className="px-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit #{index + 1} System ID: {pkg.id.split('-')[0]}</Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => clonePackage(pkg.id)}
                                                            className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
                                                            title="Clone Unit"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                        {formData.packages.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removePackage(pkg.id)}
                                                                className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Row 1: Description & Category */}
                                                <div className="col-span-8 space-y-2">
                                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Manifest Description</Label>
                                                    <Input
                                                        value={pkg.description}
                                                        onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                                                        placeholder="Item contents for manifest..."
                                                        className={cn("h-11 rounded-xl bg-slate-50/50 border-slate-100 font-bold focus:bg-white", errors[`pkg${index}Desc`] && "border-destructive")}
                                                    />
                                                </div>
                                                <div className="col-span-4 space-y-2">
                                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification</Label>
                                                    <Select
                                                        value={pkg.category}
                                                        onValueChange={(v) => updatePackage(pkg.id, "category", v)}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-100 font-bold focus:bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="General">General Cargo</SelectItem>
                                                            <SelectItem value="Electronics">Electronics</SelectItem>
                                                            <SelectItem value="Fragile">Fragile Goods</SelectItem>
                                                            <SelectItem value="Perishable">Perishables</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Row 2: Dims & Weight */}
                                                <div className="col-span-3 space-y-2">
                                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity (Pcs)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={pkg.quantity}
                                                        onChange={(e) => updatePackage(pkg.id, "quantity", parseInt(e.target.value) || 1)}
                                                        className="h-11 rounded-xl bg-slate-50/50 border-slate-100 font-black text-center"
                                                    />
                                                </div>
                                                <div className="col-span-6 space-y-2">
                                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Dimensions (L × W × H cm)</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            placeholder="L"
                                                            className="h-11 rounded-xl bg-slate-50/50 border-slate-100 font-black text-center px-1"
                                                            value={pkg.length || ""}
                                                            onChange={(e) => updatePackage(pkg.id, "length", parseFloat(e.target.value) || 0)}
                                                        />
                                                        <span className="text-slate-300 font-black">×</span>
                                                        <Input
                                                            placeholder="W"
                                                            className="h-11 rounded-xl bg-slate-50/50 border-slate-100 font-black text-center px-1"
                                                            value={pkg.width || ""}
                                                            onChange={(e) => updatePackage(pkg.id, "width", parseFloat(e.target.value) || 0)}
                                                        />
                                                        <span className="text-slate-300 font-black">×</span>
                                                        <Input
                                                            placeholder="H"
                                                            className="h-11 rounded-xl bg-slate-50/50 border-slate-100 font-black text-center px-1"
                                                            value={pkg.height || ""}
                                                            onChange={(e) => updatePackage(pkg.id, "height", parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-3 space-y-2">
                                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Actual Net Wt (kg)</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={pkg.weight}
                                                        onChange={(e) => updatePackage(pkg.id, "weight", parseFloat(e.target.value) || 0)}
                                                        className={cn("h-11 rounded-xl bg-blue-50/30 border-blue-100 font-black text-blue-600 text-center", errors[`pkg${index}Weight`] && "border-destructive")}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* Additional Charges Inputs */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-0.5">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" />
                                        Fiscal Protocol
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Pricing & Ancillary Charges</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Base Rate (₹/Kg)</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.ratePerKg}
                                            onChange={(e) => updateNestedField("charges", "ratePerKg", parseFloat(e.target.value) || 0)}
                                            className="h-12 rounded-2xl bg-primary/5 border-primary/10 font-black text-primary text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pickup Surcharge</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.pickupCharge}
                                            onChange={(e) => updateNestedField("charges", "pickupCharge", parseFloat(e.target.value) || 0)}
                                            className="h-11 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Delivery Surcharge</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.deliveryCharge}
                                            onChange={(e) => updateNestedField("charges", "deliveryCharge", parseFloat(e.target.value) || 0)}
                                            className="h-11 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Packing Solution Charge</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.packingCharge}
                                            onChange={(e) => updateNestedField("charges", "packingCharge", parseFloat(e.target.value) || 0)}
                                            className="h-11 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational / Handling</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.handlingCharge}
                                            onChange={(e) => updateNestedField("charges", "handlingCharge", parseFloat(e.target.value) || 0)}
                                            className="h-11 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">Advance Commitment (Paid)</Label>
                                        <Input
                                            type="number"
                                            value={formData.charges.advancePaid}
                                            onChange={(e) => updateNestedField("charges", "advancePaid", parseFloat(e.target.value) || 0)}
                                            className="h-12 rounded-2xl border-blue-500/20 bg-blue-500/5 font-black text-blue-600 text-lg shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Log / Remarks</Label>
                                <Textarea
                                    placeholder="Add operational notes or discrepancies..."
                                    className="mt-2 rounded-[1.5rem] bg-slate-50 border-slate-100 font-medium min-h-[100px]"
                                    value={formData.remarks}
                                    onChange={(e) => updateField("remarks", e.target.value)}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="md:col-span-5 sticky top-6">
                        <Card className="bg-slate-900 border-0 rounded-[2.5rem] shadow-2xl overflow-hidden text-white backdrop-blur-xl">
                            <CardHeader className="pb-6 border-b border-white/10 p-8">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Ledger Summary</CardTitle>
                                    <div className="p-2 rounded-full bg-blue-500/20">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Weight Logic Display */}
                                <div className="p-8 bg-white/5 space-y-4 border-b border-white/5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Actual Mass</span>
                                        <span className="text-white">{calculation.actualWeight.toFixed(1)} KG</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Volumetric Volume</span>
                                        <span className="text-white">{calculation.volumetricWeight.toFixed(1)} KG</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">Chargeable Basis</span>
                                        <span className="text-2xl font-black tracking-tighter text-white">{calculation.chargeableWeight.toFixed(1)}<span className="text-xs ml-1 opacity-40">KG</span></span>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="p-8 space-y-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategic Freight</span>
                                        <span className="font-mono text-sm">{formatCurrency(calculation.charges.freightCharge)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Logistics Surcharges</span>
                                        <span className="font-mono text-sm">{formatCurrency(calculation.charges.pickupCharge + calculation.charges.deliveryCharge + calculation.charges.packingCharge + calculation.charges.handlingCharge)}</span>
                                    </div>

                                    <div className="py-2">
                                        <Separator className="bg-white/10" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Taxable Component</span>
                                        <span className="font-mono text-sm">{formatCurrency(calculation.tax.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Government Levy</span>
                                            <p className="text-[8px] font-black text-blue-400/60 uppercase">GST Applied @ {calculation.tax.isInterState ? 18 : 18}%</p>
                                        </div>
                                        <span className="font-mono text-sm text-blue-400">+{formatCurrency(calculation.tax.totalTax)}</span>
                                    </div>

                                    <div className="pt-6 mt-4 border-t border-white/20">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Grand Protocol Total</span>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Inclusive of all surcharges</p>
                                            </div>
                                            <span className="text-4xl font-black tracking-tighter text-white leading-none">{formatCurrency(calculation.tax.grandTotal)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 flex justify-between items-center mt-6">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Outstanding Commitment</span>
                                            <p className="text-[10px] font-bold text-slate-300">After Advance Commitment</p>
                                        </div>
                                        <span className="text-xl font-black text-white">{formatCurrency(calculation.balanceDue)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Terms and Actions */}
                <div className="mt-6 space-y-4 max-w-2xl">
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
                        <Button variant="outline" onClick={onCancel} disabled={isSubmitting} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                            Discard Draft
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[160px] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Finalizing Protocol...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" /> Generate Shipment Console
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <InvoicePrintView
                invoiceNo={formData.invoiceNo}
                awbNo={formData.awbNo}
                invoiceDate={formData.invoiceDate}
                consignor={formData.consignor}
                consignee={formData.consignee}
                paymentMode={formData.paymentMode}
                packages={formData.packages.map(p => ({
                    description: p.description,
                    quantity: p.quantity,
                    weight: p.weight,
                    declaredValue: p.declaredValue
                }))}
                calculation={calculation}
            />
        </div >
    );
}
