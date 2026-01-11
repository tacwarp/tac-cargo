"use client";

import React from "react";
import { ShipmentData, FinancialTotals } from "@/types/invoice-v2";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PricingWidgetProps {
    data: ShipmentData;
    totals: FinancialTotals;
    onUpdate: (field: keyof ShipmentData, value: number) => void;
}

export function PricingWidget({ data, totals, onUpdate }: PricingWidgetProps) {
    return (
        <Card className="border-slate-200 shadow-sm h-full">
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Pricing Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Rate / Kg</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                                <Input
                                    type="number"
                                    value={data.ratePerKg}
                                    onChange={(e) => onUpdate("ratePerKg", Number(e.target.value))}
                                    className="pl-7 font-black text-blue-600 border-slate-200 focus-visible:ring-blue-500/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">GST Rate %</Label>
                            <Input
                                type="number"
                                value={data.gstRate}
                                onChange={(e) => onUpdate("gstRate", Number(e.target.value))}
                                className="font-bold border-slate-200 focus-visible:ring-blue-500/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-300">Ancillary Charges</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-slate-400">Pickup</Label>
                            <Input
                                type="number"
                                value={data.pickupCharge}
                                onChange={(e) => onUpdate("pickupCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-slate-200"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-slate-400">Packing</Label>
                            <Input
                                type="number"
                                value={data.packingCharge}
                                onChange={(e) => onUpdate("packingCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-slate-200"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-slate-400">Docket</Label>
                            <Input
                                type="number"
                                value={data.docketCharges}
                                onChange={(e) => onUpdate("docketCharges", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-slate-200"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-slate-400">Insurance</Label>
                            <Input
                                type="number"
                                value={data.insuranceCharge}
                                onChange={(e) => onUpdate("insuranceCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-slate-200"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Subtotal</span>
                        <span className="text-slate-900">₹{totals.taxableAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>GST ({data.gstRate}%)</span>
                        <span className="text-slate-900">₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                    <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase font-bold text-green-600">Advance Paid</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-green-600">₹</span>
                            <Input
                                type="number"
                                value={data.advancePaid}
                                onChange={(e) => onUpdate("advancePaid", Number(e.target.value))}
                                className="pl-7 font-black text-green-700 bg-white border-green-100 focus-visible:ring-green-500/20"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Balance Due</span>
                        <span className="text-xl font-black text-slate-900">₹{totals.balance.toFixed(0)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
