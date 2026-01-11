"use client";

import React, { useState, useMemo } from "react";
import { ShipmentData, Address, PackageItem } from "@/types/invoice-v2";
import { generateInvoiceId, generateAWB, formatDate, calculateLedger, GENERATOR_DEFAULTS } from "@/lib/invoice/generator-v2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Printer, RefreshCcw, Save } from "lucide-react";
import { AddressCard } from "./address-card";
import { InventoryTable } from "./inventory-table";
import { PricingWidget } from "./pricing-widget";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoicePrint } from "./invoice-print";
import { LabelPrint } from "./label-print";
import { CardContent } from "@/components/ui/card"; // Added missing import for CardContent

const INITIAL_ADDRESS: Address = {
    name: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: ""
};

const INITIAL_ITEM: PackageItem = {
    id: "init-1",
    description: "General Merchandise",
    length: 30,
    width: 30,
    height: 30,
    actualWeight: 1
};

export default function InvoiceGenerator() {
    const [activeTab, setActiveTab] = useState("form");
    const [isGenerated, setIsGenerated] = useState(false);

    // Core State
    const [data, setData] = useState<ShipmentData>({
        invoiceId: generateInvoiceId(),
        awbNumber: generateAWB(),
        date: formatDate(new Date()),
        consignor: { ...INITIAL_ADDRESS, name: "TAPAN ASSOCIATE CARGO", line1: "1498, Gr. Floor, Wazir Nagar", city: "New Delhi", state: "Delhi", zip: "110003", phone: "9711011416" },
        consignee: { ...INITIAL_ADDRESS },
        items: [INITIAL_ITEM],
        volumetricFactor: GENERATOR_DEFAULTS.VOLUMETRIC_FACTOR,
        ratePerKg: GENERATOR_DEFAULTS.DEFAULT_RATE,
        gstRate: GENERATOR_DEFAULTS.DEFAULT_GST,
        paymentMode: "To Pay",
        natureOfQuantity: "Others",
        declaredValue: "USED",
        bookingRemarks: "",
        pickupCharge: 0,
        packingCharge: 0,
        docketCharges: 0,
        insuranceCharge: 0,
        advancePaid: 0
    });

    // Computed Logic
    const totals = useMemo(() => calculateLedger(data), [data]);

    // Handlers
    const updateAddress = (type: "consignor" | "consignee", field: keyof Address, value: string) => {
        setData(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
    };

    const handleGenerate = () => {
        if (!data.consignee.name) {
            alert("Please enter Consignee Name");
            return;
        }
        setIsGenerated(true);
        setActiveTab("invoice");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">TAC</span>
                        <span className="ml-1 w-2 h-2 rounded-full bg-orange-500"></span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isGenerated ? (
                        <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wide">
                            <Save className="w-4 h-4 mr-2" /> Generate Invoice
                        </Button>
                    ) : (
                        <Button onClick={handlePrint} variant="outline" className="border-slate-900 text-slate-900 font-black uppercase tracking-wide hover:bg-slate-900 hover:text-white transition-colors">
                            <Printer className="w-4 h-4 mr-2" /> Print Documents
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full no-print">
                <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                    <TabsTrigger value="form" className="font-bold">Entry Form</TabsTrigger>
                    <TabsTrigger value="invoice" disabled={!isGenerated} className="font-bold">Tax Invoice</TabsTrigger>
                    <TabsTrigger value="label" disabled={!isGenerated} className="font-bold">AWB Label</TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="mt-6 animate-in fade-in-50 no-print">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AddressCard
                                    title="Consignor (Sender)"
                                    address={data.consignor}
                                    onChange={(f, v) => updateAddress("consignor", f, v)}
                                />
                                <AddressCard
                                    title="Consignee (Receiver)"
                                    address={data.consignee}
                                    onChange={(f, v) => updateAddress("consignee", f, v)}
                                />
                            </div>

                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-3 gap-6 mb-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-bold text-slate-400">Nature of Goods</Label>
                                            <Input
                                                value={data.natureOfQuantity}
                                                onChange={(e) => setData(p => ({ ...p, natureOfQuantity: e.target.value }))}
                                                className="font-bold border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-bold text-slate-400">Declared Value</Label>
                                            <Input
                                                value={data.declaredValue}
                                                onChange={(e) => setData(p => ({ ...p, declaredValue: e.target.value }))}
                                                className="font-bold border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-bold text-slate-400">Booking Remarks</Label>
                                            <Input
                                                value={data.bookingRemarks}
                                                onChange={(e) => setData(p => ({ ...p, bookingRemarks: e.target.value }))}
                                                className="font-bold border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <InventoryTable
                                        items={data.items}
                                        volumetricFactor={data.volumetricFactor}
                                        onUpdate={(items) => setData(p => ({ ...p, items }))}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <PricingWidget
                                data={data}
                                totals={totals}
                                onUpdate={(f, v) => setData(p => ({ ...p, [f]: v }))}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="invoice" className="flex justify-center bg-slate-100/50 p-8 rounded-xl border border-dashed border-slate-300 min-h-[500px]">
                    <InvoicePrint data={data} totals={totals} />
                </TabsContent>

                <TabsContent value="label" className="flex justify-center bg-slate-100/50 p-8 rounded-xl border border-dashed border-slate-300 min-h-[500px]">
                    <LabelPrint data={data} />
                </TabsContent>
            </Tabs>

            {/* Print Engines will go here */}
        </div>
    );
}
