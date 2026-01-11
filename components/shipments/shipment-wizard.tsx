"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    MapPin,
    Package,
    CreditCard,
    Check,
    ChevronRight,
    ChevronLeft,
    Loader2,
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
import { toast } from "sonner";
import { createShipment } from "@/app/actions/shipments";

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface Customer {
    id: string;
    name: string;
}

interface ShipmentWizardProps {
    warehouses: Warehouse[];
    customers: Customer[];
    onSuccess: (shipment: unknown) => void;
    onCancel: () => void;
}

const steps = [
    { id: 1, name: "Consignee", icon: User, description: "Recipient details" },
    { id: 2, name: "Address", icon: MapPin, description: "Delivery address" },
    { id: 3, name: "Package", icon: Package, description: "Shipment details" },
    { id: 4, name: "Review", icon: CreditCard, description: "Confirm & create" },
];

export function ShipmentWizard({
    warehouses,
    customers,
    onSuccess,
    onCancel,
}: ShipmentWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState(() => ({
        customer_id: "",
        reference: `SHP-${new Date().getFullYear()}${Date.now().toString(36).toUpperCase()}`,
        consignee_name: "",
        consignee_phone: "",
        consignee_email: "",
        consignee_address: "",
        consignee_city: "",
        consignee_state: "",
        consignee_pincode: "",
        origin_warehouse_id: "",
        destination_warehouse_id: "",
        transport_mode: "surface" as "air" | "surface" | "express" | "economy",
        service_level_id: "",
        weight_kg: 1,
        pieces: 1,
        declared_value: 0,
        notes: "",
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.consignee_name || formData.consignee_name.length < 2) {
                newErrors.consignee_name = "Name is required (min 2 characters)";
            }
            if (!formData.consignee_phone || formData.consignee_phone.length < 10) {
                newErrors.consignee_phone = "Valid phone number is required";
            }
        }

        if (step === 2) {
            if (!formData.consignee_address || formData.consignee_address.length < 5) {
                newErrors.consignee_address = "Address is required (min 5 characters)";
            }
            if (!formData.consignee_city || formData.consignee_city.length < 2) {
                newErrors.consignee_city = "City is required";
            }
            if (!formData.consignee_state || formData.consignee_state.length < 2) {
                newErrors.consignee_state = "State is required";
            }
            if (!formData.consignee_pincode || formData.consignee_pincode.length < 5) {
                newErrors.consignee_pincode = "Valid pincode is required";
            }
        }

        if (step === 3) {
            if (formData.weight_kg <= 0) {
                newErrors.weight_kg = "Weight must be positive";
            }
            if (formData.pieces <= 0) {
                newErrors.pieces = "Pieces must be at least 1";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        if (!validateStep(currentStep)) return;

        startTransition(async () => {
            const result = await createShipment(formData);
            if (result.success) {
                toast.success("Shipment created successfully!");
                onSuccess(result.data);
            } else {
                toast.error(result.error || "Failed to create shipment");
            }
        });
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            {/* Step Indicator */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
                <nav aria-label="Progress">
                    <ol className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;

                            return (
                                <li key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCompleted
                                                    ? "hsl(var(--primary))"
                                                    : isCurrent
                                                    ? "hsl(var(--primary) / 0.1)"
                                                    : "hsl(var(--muted))",
                                                borderColor: isCompleted || isCurrent
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
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
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

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 1 && (
                            <Step1Consignee
                                formData={formData}
                                errors={errors}
                                updateField={updateField}
                                customers={customers}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Address
                                formData={formData}
                                errors={errors}
                                updateField={updateField}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Package
                                formData={formData}
                                errors={errors}
                                updateField={updateField}
                                warehouses={warehouses}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Review formData={formData} warehouses={warehouses} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 border-t border-border flex justify-between">
                <Button
                    variant="outline"
                    onClick={currentStep === 1 ? onCancel : prevStep}
                    disabled={isPending}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                {currentStep < 4 ? (
                    <Button onClick={nextStep}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Create Shipment
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

function Step1Consignee({
    formData,
    errors,
    updateField,
    customers,
}: {
    formData: Record<string, unknown>;
    errors: Record<string, string>;
    updateField: (field: string, value: string | number) => void;
    customers: Customer[];
}) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Consignee Information</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the recipient details for this shipment
                </p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label>Customer (Optional)</Label>
                    <Select
                        value={formData.customer_id as string || undefined}
                        onValueChange={(value) => updateField("customer_id", value === "_none" ? "" : value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a customer (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_none">No customer</SelectItem>
                            {customers.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Consignee Name *</Label>
                    <Input
                        value={formData.consignee_name as string}
                        onChange={(e) => updateField("consignee_name", e.target.value)}
                        placeholder="John Doe"
                        className={errors.consignee_name ? "border-destructive" : ""}
                    />
                    {errors.consignee_name && (
                        <p className="text-xs text-destructive">{errors.consignee_name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                            value={formData.consignee_phone as string}
                            onChange={(e) => updateField("consignee_phone", e.target.value)}
                            placeholder="9876543210"
                            className={errors.consignee_phone ? "border-destructive" : ""}
                        />
                        {errors.consignee_phone && (
                            <p className="text-xs text-destructive">{errors.consignee_phone}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Email (Optional)</Label>
                        <Input
                            type="email"
                            value={formData.consignee_email as string}
                            onChange={(e) => updateField("consignee_email", e.target.value)}
                            placeholder="john@example.com"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Step2Address({
    formData,
    errors,
    updateField,
}: {
    formData: Record<string, unknown>;
    errors: Record<string, string>;
    updateField: (field: string, value: string | number) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                    Where should this shipment be delivered?
                </p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label>Street Address *</Label>
                    <Textarea
                        value={formData.consignee_address as string}
                        onChange={(e) => updateField("consignee_address", e.target.value)}
                        placeholder="123 Main Street, Building Name, Floor"
                        rows={3}
                        className={errors.consignee_address ? "border-destructive" : ""}
                    />
                    {errors.consignee_address && (
                        <p className="text-xs text-destructive">{errors.consignee_address}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                            value={formData.consignee_city as string}
                            onChange={(e) => updateField("consignee_city", e.target.value)}
                            placeholder="Mumbai"
                            className={errors.consignee_city ? "border-destructive" : ""}
                        />
                        {errors.consignee_city && (
                            <p className="text-xs text-destructive">{errors.consignee_city}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>State *</Label>
                        <Input
                            value={formData.consignee_state as string}
                            onChange={(e) => updateField("consignee_state", e.target.value)}
                            placeholder="Maharashtra"
                            className={errors.consignee_state ? "border-destructive" : ""}
                        />
                        {errors.consignee_state && (
                            <p className="text-xs text-destructive">{errors.consignee_state}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Pincode *</Label>
                    <Input
                        value={formData.consignee_pincode as string}
                        onChange={(e) => updateField("consignee_pincode", e.target.value)}
                        placeholder="400001"
                        className={errors.consignee_pincode ? "border-destructive" : ""}
                    />
                    {errors.consignee_pincode && (
                        <p className="text-xs text-destructive">{errors.consignee_pincode}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Step3Package({
    formData,
    errors,
    updateField,
    warehouses,
}: {
    formData: Record<string, unknown>;
    errors: Record<string, string>;
    updateField: (field: string, value: string | number) => void;
    warehouses: Warehouse[];
}) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Package Details</h3>
                <p className="text-sm text-muted-foreground">
                    Specify shipment details and routing
                </p>
            </div>

            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Origin Warehouse</Label>
                        <Select
                            value={formData.origin_warehouse_id as string || undefined}
                            onValueChange={(value) => updateField("origin_warehouse_id", value === "_none" ? "" : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select origin (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_none">Not specified</SelectItem>
                                {warehouses.map((w) => (
                                    <SelectItem key={w.id} value={w.id}>
                                        {w.name} ({w.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Destination Warehouse</Label>
                        <Select
                            value={formData.destination_warehouse_id as string || undefined}
                            onValueChange={(value) => updateField("destination_warehouse_id", value === "_none" ? "" : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_none">Not specified</SelectItem>
                                {warehouses.map((w) => (
                                    <SelectItem key={w.id} value={w.id}>
                                        {w.name} ({w.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <Select
                        value={formData.transport_mode as string}
                        onValueChange={(value) => updateField("transport_mode", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="air">Air Freight</SelectItem>
                            <SelectItem value="surface">Surface Transport</SelectItem>
                            <SelectItem value="express">Express Delivery</SelectItem>
                            <SelectItem value="economy">Economy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Weight (kg) *</Label>
                        <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={formData.weight_kg as number}
                            onChange={(e) => updateField("weight_kg", parseFloat(e.target.value) || 0)}
                            className={errors.weight_kg ? "border-destructive" : ""}
                        />
                        {errors.weight_kg && (
                            <p className="text-xs text-destructive">{errors.weight_kg}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Pieces *</Label>
                        <Input
                            type="number"
                            min="1"
                            value={formData.pieces as number}
                            onChange={(e) => updateField("pieces", parseInt(e.target.value) || 1)}
                            className={errors.pieces ? "border-destructive" : ""}
                        />
                        {errors.pieces && (
                            <p className="text-xs text-destructive">{errors.pieces}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Declared Value (₹)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.declared_value as number}
                            onChange={(e) => updateField("declared_value", parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                        value={formData.notes as string}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Special handling instructions..."
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}

function Step4Review({
    formData,
    warehouses,
}: {
    formData: Record<string, unknown>;
    warehouses: Warehouse[];
}) {
    const originWarehouse = warehouses.find((w) => w.id === formData.origin_warehouse_id);
    const destWarehouse = warehouses.find((w) => w.id === formData.destination_warehouse_id);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground">
                    Please review the shipment details before creating
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Consignee
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Name:</span>{" "}
                            <span className="font-medium">{String(formData.consignee_name || "")}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Phone:</span>{" "}
                            <span className="font-medium">{String(formData.consignee_phone || "")}</span>
                        </div>
                        {Boolean(formData.consignee_email) && (
                            <div className="col-span-2">
                                <span className="text-muted-foreground">Email:</span>{" "}
                                <span className="font-medium">{String(formData.consignee_email)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Delivery Address
                    </h4>
                    <div className="text-sm">
                        <p className="font-medium">{String(formData.consignee_address || "")}</p>
                        <p>
                            {String(formData.consignee_city || "")}, {String(formData.consignee_state || "")} -{" "}
                            {String(formData.consignee_pincode || "")}
                        </p>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Shipment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Reference:</span>{" "}
                            <span className="font-mono font-medium">{String(formData.reference || "")}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Mode:</span>{" "}
                            <span className="font-medium capitalize">{String(formData.transport_mode || "")}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Weight:</span>{" "}
                            <span className="font-medium">{Number(formData.weight_kg) || 0} kg</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Pieces:</span>{" "}
                            <span className="font-medium">{Number(formData.pieces) || 0}</span>
                        </div>
                        {originWarehouse && (
                            <div>
                                <span className="text-muted-foreground">From:</span>{" "}
                                <span className="font-medium">{originWarehouse.code}</span>
                            </div>
                        )}
                        {destWarehouse && (
                            <div>
                                <span className="text-muted-foreground">To:</span>{" "}
                                <span className="font-medium">{destWarehouse.code}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
