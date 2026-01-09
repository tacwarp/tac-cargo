"use client";

import React, { useState, useTransition } from "react";
import {
    CreditCard,
    AlertCircle,
    CheckCircle,
    ArrowDownLeft,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { recordPayment } from "@/app/actions/payments";
import type { PaymentStatus } from "@/types/database";

interface Payment {
    id: string;
    amount: number;
    payment_method: string;
    payment_reference: string | null;
    status: PaymentStatus;
    notes: string | null;
    created_at: string;
    invoices: { invoice_no: string; total_amount: number; customers: { name: string } | null } | null;
}

interface OutstandingInvoice {
    id: string;
    invoice_no: string;
    total_amount: number;
    balance_due: number;
    due_date: string | null;
    status: string;
    customers: { name: string; phone: string } | null;
}

interface PaymentStats {
    totalReceived: number;
    totalOutstanding: number;
    overdueCount: number;
}

interface PaymentsClientProps {
    initialPayments: Payment[];
    outstandingInvoices: OutstandingInvoice[];
    stats: PaymentStats;
}

const paymentMethodLabels: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    bank_transfer: "Bank Transfer",
    card: "Card",
    cheque: "Cheque",
};

export function PaymentsClient({
    initialPayments,
    outstandingInvoices,
    stats
}: PaymentsClientProps) {
    const [payments, setPayments] = useState(initialPayments);
    const [outstanding, setOutstanding] = useState(outstandingInvoices);
    const [selectedInvoice, setSelectedInvoice] = useState<OutstandingInvoice | null>(null);
    const [isRecordOpen, setIsRecordOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassPanel className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-success/10">
                            <ArrowDownLeft className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-success">
                                ₹{stats.totalReceived.toLocaleString("en-IN")}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Received</div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-warning/10">
                            <ArrowUpRight className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-warning">
                                ₹{stats.totalOutstanding.toLocaleString("en-IN")}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding</div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className={cn(
                    "p-6",
                    stats.overdueCount > 0 && "border-destructive/30 bg-destructive/5"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-destructive/10">
                            <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-destructive">{stats.overdueCount}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Overdue Invoices</div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outstanding Invoices */}
                <GlassPanel className="p-0">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">Outstanding Invoices</h3>
                        <span className="text-xs text-muted-foreground">{outstanding.length} pending</span>
                    </div>
                    <div className="divide-y divide-border max-h-[50vh] overflow-y-auto">
                        {outstanding.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                                <div>All invoices paid!</div>
                            </div>
                        ) : (
                            outstanding.map((invoice) => {
                                const isOverdue = invoice.status === "overdue";
                                return (
                                    <div
                                        key={invoice.id}
                                        className={cn(
                                            "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                            isOverdue && "bg-destructive/5"
                                        )}
                                        onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setIsRecordOpen(true);
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-mono text-sm text-foreground">{invoice.invoice_no}</div>
                                                <div className="text-xs text-muted-foreground">{invoice.customers?.name || "—"}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    ₹{invoice.balance_due.toLocaleString("en-IN")}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    of ₹{invoice.total_amount.toLocaleString("en-IN")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            {invoice.due_date && (
                                                <span className={cn(
                                                    isOverdue ? "text-destructive" : "text-muted-foreground"
                                                )}>
                                                    Due: {new Date(invoice.due_date).toLocaleDateString("en-IN")}
                                                </span>
                                            )}
                                            <Button size="sm" variant="outline" className="h-6 text-xs">
                                                Record Payment
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </GlassPanel>

                {/* Recent Payments */}
                <GlassPanel className="p-0">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-medium text-foreground">Recent Payments</h3>
                    </div>
                    <div className="divide-y divide-border max-h-[50vh] overflow-y-auto">
                        {payments.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <div>No payments recorded</div>
                            </div>
                        ) : (
                            payments.map((payment) => {
                                const isRefund = payment.status === "refunded";
                                return (
                                    <div key={payment.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    isRefund ? "bg-destructive/10" : "bg-success/10"
                                                )}>
                                                    {isRefund ? (
                                                        <ArrowUpRight className="w-4 h-4 text-destructive" />
                                                    ) : (
                                                        <ArrowDownLeft className="w-4 h-4 text-success" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-foreground">
                                                        {payment.invoices?.customers?.name || "Payment"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {payment.invoices?.invoice_no} • {paymentMethodLabels[payment.payment_method] || payment.payment_method}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={cn(
                                                    "text-sm font-mono",
                                                    isRefund ? "text-destructive" : "text-success"
                                                )}>
                                                    {isRefund ? "-" : "+"}₹{payment.amount.toLocaleString("en-IN")}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {new Date(payment.created_at).toLocaleDateString("en-IN")}
                                                </div>
                                            </div>
                                        </div>
                                        {payment.payment_reference && (
                                            <div className="text-xs text-muted-foreground ml-11">
                                                Ref: {payment.payment_reference}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </GlassPanel>
            </div>

            {/* Record Payment Dialog */}
            <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    {selectedInvoice && (
                        <RecordPaymentForm
                            invoice={selectedInvoice}
                            onSuccess={(payment) => {
                                setPayments(prev => [payment as Payment, ...prev]);
                                setOutstanding(prev =>
                                    prev.map(i =>
                                        i.id === selectedInvoice.id
                                            ? { ...i, balance_due: i.balance_due - (payment as Payment).amount }
                                            : i
                                    ).filter(i => i.balance_due > 0)
                                );
                                setIsRecordOpen(false);
                                toast.success("Payment recorded");
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function RecordPaymentForm({
    invoice,
    onSuccess
}: {
    invoice: OutstandingInvoice;
    onSuccess: (payment: unknown) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        amount: invoice.balance_due,
        paymentMethod: "cash" as "cash" | "upi" | "bank_transfer" | "card" | "cheque",
        paymentReference: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await recordPayment({
                invoiceId: invoice.id,
                amount: formData.amount,
                paymentMethod: formData.paymentMethod,
                paymentReference: formData.paymentReference || undefined,
                notes: formData.notes || undefined,
            });
            if (result.success) {
                onSuccess(result.data);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invoice</span>
                    <span className="text-foreground font-mono">{invoice.invoice_no}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="text-foreground">{invoice.customers?.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="text-warning font-mono">₹{invoice.balance_due.toLocaleString("en-IN")}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        min={1}
                        max={invoice.balance_due}
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as typeof formData.paymentMethod }))}
                        className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground"
                    >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card</option>
                        <option value="cheque">Cheque</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Reference / Transaction ID</Label>
                <Input
                    value={formData.paymentReference}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentReference: e.target.value }))}
                    placeholder="Optional"
                />
            </div>

            <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional"
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Recording..." : "Record Payment"}
                </Button>
            </div>
        </form>
    );
}
