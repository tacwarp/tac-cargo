"use client";

import React, { useState, useTransition } from "react";
import {
    FileText,
    Tag,
    Send,
    MoreHorizontal,
    Plus,
    CheckCircle,
    Clock,
    AlertCircle,
    MessageCircle,
    Download,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    generateLabelInvoice,
    regenerateInvoice
} from "@/app/actions/invoices";
import { sendInvoiceViaWhatsApp, getWhatsAppLink } from "@/app/actions/whatsapp";
import type { InvoiceType, InvoiceStatus } from "@/types/database";

interface Invoice {
    id: string;
    invoice_no: string;
    type: InvoiceType;
    status: InvoiceStatus;
    awb_no: string | null;
    consignee_name: string | null;
    consignee_address: string | null;
    consignee_city: string | null;
    consignee_state: string | null;
    consignee_pincode: string | null;
    subtotal: number;
    total_tax: number;
    total_amount: number;
    balance_due: number;
    invoice_date: string;
    due_date: string | null;
    pdf_url: string | null;
    sent_via_whatsapp_at: string | null;
    created_at: string;
    customers: { id: string; name: string; phone: string; email: string | null } | null;
    shipments: { id: string; reference: string; pieces: number | null } | null;
}

interface ShipmentWithoutInvoice {
    id: string;
    reference: string;
    consignee_name: string | null;
    pieces: number | null;
    customers: { name: string; phone: string } | null;
}

interface InvoicesClientProps {
    initialInvoices: Invoice[];
    shipmentsWithoutInvoice: ShipmentWithoutInvoice[];
}

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border", icon: FileText },
    generated: { label: "Generated", color: "bg-primary/10 text-primary border-primary/20", icon: FileText },
    sent: { label: "Sent", color: "bg-primary/10 text-primary border-primary/20", icon: Send },
    paid: { label: "Paid", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-border", icon: Clock },
    generation_failed: { label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
};

export function InvoicesClient({
    initialInvoices,
    shipmentsWithoutInvoice: initialShipments
}: Readonly<InvoicesClientProps>) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [shipments] = useState(initialShipments);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPending, startTransition] = useTransition();

    const labelInvoices = invoices.filter(i => i.type === "label");
    const customerInvoices = invoices.filter(i => i.type === "customer");
    const unpaidInvoices = customerInvoices.filter(i => i.status !== "paid" && i.status !== "cancelled");

    const handleGenerateLabel = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await generateLabelInvoice({ shipmentId });
            if (result.success) {
                setInvoices(prev => [{
                    ...result.data,
                    customers: null,
                    shipments: null,
                } as Invoice, ...prev]);
                toast.success("Label generated");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleSendWhatsApp = async (invoiceId: string) => {
        startTransition(async () => {
            const linkResult = await getWhatsAppLink(invoiceId);
            if (linkResult.success) {
                window.open(linkResult.data.url, "_blank");

                const sendResult = await sendInvoiceViaWhatsApp(invoiceId);
                if (sendResult.success) {
                    setInvoices(prev =>
                        prev.map(i => i.id === invoiceId ? { ...i, status: "sent" as InvoiceStatus, sent_via_whatsapp_at: new Date().toISOString() } : i)
                    );
                    toast.success("Invoice sent via WhatsApp");
                }
            } else {
                toast.error(linkResult.error);
            }
        });
    };

    const handleRegenerate = async (invoiceId: string) => {
        startTransition(async () => {
            const result = await regenerateInvoice(invoiceId);
            if (result.success) {
                toast.success("Invoice queued for regeneration");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Tabs defaultValue="customer" className="space-y-6">
            <div className="flex justify-between items-center">
                <TabsList>
                    <TabsTrigger value="customer" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Customer Invoices
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{customerInvoices.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="labels" className="gap-2">
                        <Tag className="w-4 h-4" />
                        Labels
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{labelInvoices.length}</span>
                    </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                    {shipments.length > 0 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="gap-1">
                                    <Plus className="w-4 h-4" />
                                    Generate Invoice
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generate Invoice for Shipment</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {shipments.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{s.reference}</div>
                                                <div className="text-xs text-muted-foreground">{s.consignee_name}</div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleGenerateLabel(s.id)}
                                                disabled={isPending}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <TabsContent value="customer" className="space-y-4">
                <div className="flex gap-6">
                    {/* Invoice List */}
                    <GlassPanel className="w-80 flex-shrink-0 p-4">
                        <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                            Unpaid ({unpaidInvoices.length})
                        </h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {unpaidInvoices.length === 0 ? (
                                <div className="text-xs text-muted-foreground text-center py-8">No unpaid invoices</div>
                            ) : (
                                unpaidInvoices.map((invoice) => (
                                    <InvoiceListItem
                                        key={invoice.id}
                                        invoice={invoice}
                                        isSelected={selectedInvoice?.id === invoice.id}
                                        onClick={() => setSelectedInvoice(invoice)}
                                    />
                                ))
                            )}
                        </div>
                    </GlassPanel>

                    {/* Invoice Detail */}
                    <div className="flex-1">
                        {selectedInvoice ? (
                            <InvoiceDetail
                                invoice={selectedInvoice}
                                onSendWhatsApp={handleSendWhatsApp}
                                onRegenerate={handleRegenerate}
                                isPending={isPending}
                            />
                        ) : (
                            <GlassPanel className="h-full flex items-center justify-center p-12">
                                <div className="text-center text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Select an invoice to view details</p>
                                </div>
                            </GlassPanel>
                        )}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="labels" className="space-y-4">
                <GlassPanel className="p-0">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-medium text-foreground">Shipping Labels</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {labelInvoices.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No labels generated</div>
                        ) : (
                            labelInvoices.map((label) => (
                                <div key={label.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Tag className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium text-foreground">{label.invoice_no}</div>
                                            <div className="text-xs text-muted-foreground">
                                                AWB: {label.awb_no} • {label.consignee_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {label.pdf_url && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => window.open(label.pdf_url!, "_blank")}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleRegenerate(label.id)}>
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Regenerate
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassPanel>
            </TabsContent>
        </Tabs>
    );
}

function InvoiceListItem({
    invoice,
    isSelected,
    onClick
}: {
    invoice: Invoice;
    isSelected: boolean;
    onClick: () => void;
}) {
    const status = statusConfig[invoice.status] || statusConfig.draft;

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                isSelected
                    ? "bg-muted/50 border border-primary/30"
                    : "hover:bg-muted/50 border border-transparent"
            )}
            onClick={onClick}
        >
            <FileText className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{invoice.invoice_no}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    ₹{invoice.total_amount.toLocaleString("en-IN")}
                </div>
            </div>
            <span className={cn(
                "text-[9px] px-1.5 py-0.5 rounded border",
                status.color
            )}>
                {status.label}
            </span>
        </div>
    );
}

function InvoiceDetail({
    invoice,
    onSendWhatsApp,
    onRegenerate,
    isPending
}: {
    invoice: Invoice;
    onSendWhatsApp: (id: string) => void;
    onRegenerate: (id: string) => void;
    isPending: boolean;
}) {
    return (
        <div className="bg-card rounded-lg shadow-2xl p-8 text-foreground border border-border">
            {/* Header */}
            <div className="flex justify-between border-b border-border pb-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">INVOICE</h1>
                    <p className="text-sm text-primary font-medium mt-1">#{invoice.invoice_no}</p>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">TAC CARGO</div>
                    <div className="text-sm text-muted-foreground">Logistics Services</div>
                </div>
            </div>

            {/* Bill To & Details */}
            <div className="flex justify-between mb-8 text-sm">
                <div>
                    <div className="text-muted-foreground mb-1">Bill To:</div>
                    <div className="font-bold">{invoice.consignee_name || invoice.customers?.name}</div>
                    {invoice.consignee_address && <div>{invoice.consignee_address}</div>}
                    <div>
                        {[invoice.consignee_city, invoice.consignee_state, invoice.consignee_pincode]
                            .filter(Boolean)
                            .join(", ")}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-muted-foreground mb-1">Details:</div>
                    <div>
                        <span className="text-muted-foreground mr-2">Date:</span>
                        {new Date(invoice.invoice_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                        })}
                    </div>
                    {invoice.due_date && (
                        <div>
                            <span className="text-muted-foreground mr-2">Due:</span>
                            {new Date(invoice.due_date).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            })}
                        </div>
                    )}
                    {invoice.shipments && (
                        <div className="mt-2 text-muted-foreground">
                            Shipment: {invoice.shipments.reference}
                        </div>
                    )}
                </div>
            </div>

            {/* Amounts */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-mono">₹{invoice.total_tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono">₹{invoice.total_amount.toLocaleString("en-IN")}</span>
                </div>
                {invoice.balance_due > 0 && invoice.balance_due !== invoice.total_amount && (
                    <div className="flex justify-between py-2 text-destructive">
                        <span>Balance Due</span>
                        <span className="font-mono">₹{invoice.balance_due.toLocaleString("en-IN")}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
                {invoice.pdf_url && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(invoice.pdf_url!, "_blank")}
                        className="gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </Button>
                )}
                <Button
                    size="sm"
                    onClick={() => onSendWhatsApp(invoice.id)}
                    disabled={isPending || !invoice.customers?.phone}
                    className="gap-2"
                >
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRegenerate(invoice.id)}
                    disabled={isPending}
                >
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {invoice.sent_via_whatsapp_at && (
                <div className="mt-4 text-xs text-muted-foreground">
                    Sent via WhatsApp on {new Date(invoice.sent_via_whatsapp_at).toLocaleString("en-IN")}
                </div>
            )}
        </div>
    );
}
