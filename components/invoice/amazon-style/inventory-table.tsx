"use client";

import React from "react";
import { PackageItem, ShipmentData } from "@/types/invoice-v2";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Package } from "lucide-react";
import { calculateVolumetricWeight } from "@/lib/invoice/generator-v2";
import { Badge } from "@/components/ui/badge";

interface InventoryTableProps {
    items: PackageItem[];
    volumetricFactor: number;
    onUpdate: (items: PackageItem[]) => void;
}

export function InventoryTable({ items, volumetricFactor, onUpdate }: InventoryTableProps) {

    const updateItem = (id: string, field: keyof PackageItem, value: string | number) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onUpdate(newItems);
    };

    const addItem = () => {
        const newItem: PackageItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: "General Merchandise",
            length: 30,
            width: 30,
            height: 30,
            actualWeight: 1
        };
        onUpdate([...items, newItem]);
    };

    const removeItem = (id: string) => {
        onUpdate(items.filter(i => i.id !== id));
    };

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Cargo Inventory</h3>
                </div>
                <Button variant="outline" size="sm" onClick={addItem} className="h-8 text-[10px] uppercase font-bold tracking-wider border-slate-200 hover:bg-white hover:text-blue-600">
                    <Plus className="w-3 h-3 mr-1" /> Add Unit
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50">
                        <TableHead className="w-[40%] text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</TableHead>
                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Dims (L/W/H)</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Act. Wt</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Vol. Wt</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => {
                        const volWeight = calculateVolumetricWeight(item.length, item.width, item.height, volumetricFactor);
                        const isVolumetric = volWeight > item.actualWeight;

                        return (
                            <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-50">
                                <TableCell className="py-3">
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                        className="h-8 font-medium border-transparent hover:border-slate-200 focus:border-blue-500/20 bg-transparent"
                                    />
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <Input
                                            type="number"
                                            value={item.length}
                                            onChange={(e) => updateItem(item.id, "length", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-slate-200"
                                        />
                                        <span className="text-slate-300">×</span>
                                        <Input
                                            type="number"
                                            value={item.width}
                                            onChange={(e) => updateItem(item.id, "width", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-slate-200"
                                        />
                                        <span className="text-slate-300">×</span>
                                        <Input
                                            type="number"
                                            value={item.height}
                                            onChange={(e) => updateItem(item.id, "height", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-slate-200"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Input
                                        type="number"
                                        value={item.actualWeight}
                                        onChange={(e) => updateItem(item.id, "actualWeight", Number(e.target.value))}
                                        className="h-8 w-16 text-right ml-auto font-black border-slate-200"
                                    />
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Badge variant="secondary" className={`font-mono text-[10px] ${isVolumetric ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-slate-100 text-slate-400"}`}>
                                        {volWeight.toFixed(2)} KG
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-red-500" onClick={() => removeItem(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
