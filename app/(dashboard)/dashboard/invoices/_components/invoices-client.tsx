"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    AlertCircle,
    Search,
    Eye,
    Download,
    MessageCircle,
    RefreshCw,
    Receipt,
    TrendingUp,
    Hourglass,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
    generateLabelInvoice,
    regenerateInvoice
} from "@/app/actions/invoices";
import { sendInvoiceViaWhatsApp, getWhatsAppLink } from "@/app/actions/whatsapp";
import { IllustratedEmptyState } from "@/components/dashboard/illustrated-empty-state";
import { InvoiceCreationForm } from "@/components/invoice/invoice-creation-form";
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

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; bgColor: string }> = {
    draft: { label: "Draft", variant: "outline", bgColor: "bg-muted" },
    pending: { label: "Pending", variant: "secondary", bgColor: "bg-amber-100 text-amber-700" },
    paid: { label: "Paid", variant: "default", bgColor: "bg-emerald-100 text-emerald-700" },
    partial: { label: "Partial", variant: "secondary", bgColor: "bg-blue-100 text-blue-700" },
    overdue: { label: "Overdue", variant: "destructive", bgColor: "bg-red-100 text-red-700" },
    cancelled: { label: "Cancelled", variant: "outline", bgColor: "bg-muted" },
};

export function InvoicesClient({
    initialInvoices,
    shipmentsWithoutInvoice: initialShipments
}: Readonly<InvoicesClientProps>) {
    const router = useRouter();
    const [invoices, setInvoices] = useState(initialInvoices);
    const [shipments] = useState(initialShipments);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Stats calculations
    const stats = useMemo(() => ({
        total: invoices.length,
        pending: invoices.filter(i => i.status === "pending").length,
        paid: invoices.filter(i => i.status === "paid").length,
        overdue: invoices.filter(i => i.status === "overdue").length,
    }), [invoices]);

    // Filtered invoices based on search
    const filteredInvoices = useMemo(() => {
        if (!searchQuery.trim()) return invoices;
        const query = searchQuery.toLowerCase();
        return invoices.filter(i =>
            i.invoice_no.toLowerCase().includes(query) ||
            i.consignee_name?.toLowerCase().includes(query) ||
            i.customers?.name.toLowerCase().includes(query)
        );
    }, [invoices, searchQuery]);

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
                        prev.map(i => i.id === invoiceId ? { ...i, sent_via_whatsapp_at: new Date().toISOString() } : i)
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

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredInvoices.map(i => i.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedIds(newSet);
    };

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewOpen(true);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={Receipt}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-600"
                    label="Total Invoices"
                    value={stats.total.toString()}
                    subValue="All time"
                />
                <StatsCard
                    icon={TrendingUp}
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-600"
                    label="Paid Invoices"
                    value={stats.paid.toString()}
                    subValue={`${Math.round((stats.paid / (stats.total || 1)) * 100)}% completion`}
                />
                <StatsCard
                    icon={Hourglass}
                    iconBg="bg-amber-500/10"
                    iconColor="text-amber-600"
                    label="Pending Invoices"
                    value={stats.pending.toString()}
                    subValue="Awaiting payment"
                />
                <StatsCard
                    icon={AlertCircle}
                    iconBg="bg-red-500/10"
                    iconColor="text-red-600"
                    label="Overdue Invoices"
                    value={stats.overdue.toString()}
                    subValue="Action required"
                />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Invoice #, Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Quick Label from existing shipment */}
                    {shipments.length > 0 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                    <Tag className="w-4 h-4" />
                                    Quick Label
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Generate Label for Shipment</DialogTitle>
                                    <DialogDescription>Select a shipment below to generate a shipping label.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                                    {shipments.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">{s.reference}</span>
                                                <span className="text-xs text-muted-foreground">{s.consignee_name} • {s.pieces} pcs</span>
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

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 w-full sm:w-auto shadow-md">
                                <Plus className="w-4 h-4" />
                                Create Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl h-[95vh] p-0 gap-0 overflow-hidden bg-background flex flex-col">
                            <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                                <DialogTitle>Create New Invoice</DialogTitle>
                                <DialogDescription>Generate a comprehensive invoice with automated calculations.</DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-hidden relative">
                                <InvoiceCreationForm 
                                    onSuccess={() => {
                                        setIsCreateOpen(false);
                                        router.refresh();
                                    }}
                                    onCancel={() => setIsCreateOpen(false)}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Invoice Table */}
            <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    {filteredInvoices.length === 0 ? (
                        <div className="py-16 px-6">
                            <IllustratedEmptyState 
                                type="invoices" 
                                title={searchQuery ? "No matching invoices" : "No invoices found"}
                                description={searchQuery ? `No invoices found matching "${searchQuery}"` : "Get started by creating your first invoice."}
                                actionLabel={searchQuery ? "Clear Search" : "Create Invoice"}
                                onAction={searchQuery ? () => setSearchQuery("") : () => setIsCreateOpen(true)}
                            />
                        </div>
                    ) : (
                        <div className="relative overflow-auto max-h-[calc(100vh-350px)]">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="w-12 pl-4">
                                            <Checkbox
                                                checked={selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="w-[120px]">Invoice No.</TableHead>
                                        <TableHead className="w-[80px]">Type</TableHead>
                                        <TableHead className="min-w-[150px]">Bill From</TableHead>
                                        <TableHead className="min-w-[150px]">Bill To</TableHead>
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead className="w-[120px] text-right">Amount</TableHead>
                                        <TableHead className="w-[100px] text-center">Status</TableHead>
                                        <TableHead className="w-[120px] text-right pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map((invoice) => {
                                        const status = statusConfig[invoice.status] || statusConfig.draft;
                                        return (
                                            <TableRow key={invoice.id} className="group hover:bg-muted/30">
                                                <TableCell className="pl-4">
                                                    <Checkbox
                                                        checked={selectedIds.has(invoice.id)}
                                                        onCheckedChange={(checked) => handleSelectOne(invoice.id, !!checked)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-primary">
                                                    {invoice.invoice_no}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-mono">
                                                        {invoice.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground truncate max-w-[150px]">
                                                    {invoice.customers?.name || "TAC Cargo"}
                                                </TableCell>
                                                <TableCell className="truncate max-w-[150px]">
                                                    <div className="font-medium">{invoice.consignee_name || "-"}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{invoice.consignee_city}</div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {new Date(invoice.invoice_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-medium">
                                                    ₹{invoice.total_amount.toLocaleString("en-IN")}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge 
                                                        variant={status.variant} 
                                                        className={cn("whitespace-nowrap", status.bgColor)}
                                                    >
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleViewInvoice(invoice)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleRegenerate(invoice.id)}
                                                            disabled={isPending}
                                                            title="Regenerate PDF"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                        {/* WhatsApp Button shortcut */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-green-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSendWhatsApp(invoice.id);
                                                            }}
                                                            disabled={isPending}
                                                            title="Send WhatsApp"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Invoice Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Invoice Details</DialogTitle>
                        <DialogDescription>View and manage invoice #{selectedInvoice?.invoice_no}</DialogDescription>
                    </DialogHeader>
                    {selectedInvoice && (
                        <InvoiceDetailPanel
                            invoice={selectedInvoice}
                            onSendWhatsApp={handleSendWhatsApp}
                            onRegenerate={handleRegenerate}
                            isPending={isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatsCard({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    value,
    subValue
}: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
    subValue?: string;
}) {
    return (
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl ring-1 ring-inset ring-black/5", iconBg)}>
                        <Icon className={cn("w-6 h-6", iconColor)} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">{label}</div>
                        <div className="text-2xl font-bold tracking-tight">{value}</div>
                        {subValue && (
                            <div className="text-xs text-muted-foreground mt-1">{subValue}</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function InvoiceDetailPanel({
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
    const status = statusConfig[invoice.status] || statusConfig.draft;

    return (
        <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    status.bgColor
                )}>
                    {status.label}
                </span>
                <span className="text-sm text-muted-foreground">
                    {new Date(invoice.invoice_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                    })}
                </span>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill From</div>
                    <div className="font-medium">{invoice.customers?.name || "TAC Cargo"}</div>
                    <div className="text-sm text-muted-foreground">Logistics Services</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill To</div>
                    <div className="font-medium">{invoice.consignee_name}</div>
                    <div className="text-sm text-muted-foreground">
                        {[invoice.consignee_city, invoice.consignee_state].filter(Boolean).join(", ")}
                    </div>
                </div>
            </div>

            {/* Amounts */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-mono">₹{invoice.total_tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total</span>
                    <span className="font-mono">₹{invoice.total_amount.toLocaleString("en-IN")}</span>
                </div>
                {invoice.balance_due > 0 && invoice.balance_due !== invoice.total_amount && (
                    <div className="flex justify-between text-destructive text-sm">
                        <span>Balance Due</span>
                        <span className="font-mono">₹{invoice.balance_due.toLocaleString("en-IN")}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
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
                    WhatsApp
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRegenerate(invoice.id)}
                    disabled={isPending}
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                </Button>
            </div>

            {invoice.sent_via_whatsapp_at && (
                <div className="text-xs text-muted-foreground">
                    Sent via WhatsApp on {new Date(invoice.sent_via_whatsapp_at).toLocaleString("en-IN")}
                </div>
            )}
        </div>
    );
}
