"use client";

import React from "react";
import { Address } from "@/types/invoice-v2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Phone, Globe } from "lucide-react";

interface AddressCardProps {
    title: string;
    address: Address;
    onChange: (field: keyof Address, value: string) => void;
}

const CITIES = [
    "Imphal", "New Delhi", "Guwahati", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Aizawl", "Kohima", "Shillong"
];

const STATES = [
    "Manipur", "Delhi", "Assam", "Maharashtra", "Karnataka", "West Bengal", "Tamil Nadu", "Telangana", "Mizoram", "Nagaland", "Meghalaya"
];

export function AddressCard({ title, address, onChange }: AddressCardProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Entity Name</Label>
                    <Input
                        value={address.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="font-bold border-slate-200 focus-visible:ring-blue-500/20"
                        placeholder="Company or Person Name"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Street Address</Label>
                    <Input
                        value={address.line1}
                        onChange={(e) => onChange("line1", e.target.value)}
                        className="font-medium border-slate-200 focus-visible:ring-blue-500/20"
                        placeholder="Building, Street, Area"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">City</Label>
                        <Select value={address.city} onValueChange={(v) => onChange("city", v)}>
                            <SelectTrigger className="font-bold border-slate-200">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                {CITIES.map((c) => (
                                    <SelectItem key={c} value={c} className="font-medium">
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">State</Label>
                        <Select value={address.state} onValueChange={(v) => onChange("state", v)}>
                            <SelectTrigger className="font-bold border-slate-200">
                                <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATES.map((s) => (
                                    <SelectItem key={s} value={s} className="font-medium">
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Zip Code</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <Input
                                value={address.zip}
                                onChange={(e) => onChange("zip", e.target.value)}
                                className="pl-9 font-bold border-slate-200 focus-visible:ring-blue-500/20"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <Input
                                value={address.phone}
                                onChange={(e) => onChange("phone", e.target.value)}
                                className="pl-9 font-bold border-slate-200 focus-visible:ring-blue-500/20"
                                placeholder="+91..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Email (Optional)</Label>
                    <Input
                        value={address.email || ""}
                        onChange={(e) => onChange("email", e.target.value)}
                        className="font-medium border-slate-200 focus-visible:ring-blue-500/20"
                        placeholder="billing@company.com"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
