"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicePrint } from "./invoice-print";
import { LabelPrint } from "./label-print";
import { mapDatabaseInvoiceToV2 } from "@/lib/invoice/mapper";
import { calculateLedger } from "@/lib/invoice/generator-v2";

interface InvoiceViewerProps {
    invoice: any; // Database invoice object
}

export function InvoiceViewer({ invoice }: InvoiceViewerProps) {
    const router = useRouter();
    const data = mapDatabaseInvoiceToV2(invoice);
    const totals = calculateLedger(data);

    // If the DB has explicit totals, we might want to use them instead of recalculating?
    // However, for the print view layout, we need the breakdown. 
    // Let's assume calculateLedger is close enough or strictly respects the items.
    // If DB has explicit `total_amount` that differs from calculated, we trust the DB for the "Grand Total".

    // Override totals with DB values to ensure accuracy with what was saved
    const safeTotals = {
        ...totals,
        grandTotal: invoice.total_amount || totals.grandTotal,
        taxAmount: invoice.total_tax || totals.taxAmount,
        subTotal: invoice.subtotal || totals.taxableAmount, // Mapping subtotal to taxableAmount
        // Recalculate balance just in case
        balance: (invoice.total_amount || totals.grandTotal) - (invoice.total_amount - (invoice.balance_due || 0))
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .no-print { display: none !important; }
                    .print-area { display: block !important; }
                }
            `}</style>

            {/* Header - No Print */}
            <div className="flex items-center justify-between no-print mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => router.push("/dashboard/invoices")}
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Invoice <span className="text-slate-400">#{data.invoiceId}</span>
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {data.date} • {data.consignee.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 font-bold" onClick={() => window.open(invoice.pdf_url, '_blank')} disabled={!invoice.pdf_url}>
                        Share PDF
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={handlePrint} className="gap-2 font-black shadow-lg shadow-blue-500/20">
                        Print Document
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="invoice" className="w-full no-print">
                <div className="flex justify-center mb-8">
                    <TabsList className="bg-white p-1 rounded-full border shadow-sm">
                        <TabsTrigger value="invoice" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                            Tax Invoice
                        </TabsTrigger>
                        <TabsTrigger value="label" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                            AWB Label
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="invoice" className="flex justify-center pb-20">
                    <div className="shadow-2xl shadow-slate-200/50">
                        {/* We render InvoicePrint but it is usually hidden unless printing. 
                            Here we want to SHOW it as a preview. 
                            The Print Styles usually hide everything except .print-area.
                            But we also want to see it on screen.
                            InvoicePrint has .print-area class on it?
                            Let's check invoice-print.tsx.
                        */}
                        <InvoicePrint
                            data={data}
                            totals={safeTotals}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="label" className="flex justify-center pb-20">
                    <div className="shadow-2xl shadow-slate-200/50">
                        <LabelPrint
                            data={data}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Hidden Print Area - Logic used in Generator. 
                Actually, in Generator, the content displayed IN the tab WAS the print area.
                So we don't need a separate hidden div if the visible tab content IS the print content.
                BUT, we have Tabs. If "Label" is active, we print Label. If "Invoice" is active, we print Invoice.
                
                The `InvoicePrint` component has `className="print-area bg-white..."`.
                The `LabelPrint` component has `className="print-area..."`.
                
                If both are rendered (one hidden by Tabs), window.print() might print the hidden one too if proper CSS isn't set.
                Shadcn Tabs unmount content? Or hide it?
                Radix Tabs: "When `forceMount` is not set, unmounts content".
                So only the active tab is in DOM.
                Perfect.
            */}
        </div>
    );
}
