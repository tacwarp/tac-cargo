import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { PaymentsClient } from "./_components/payments-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getPayments() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("payments")
        .select(`
            id,
            amount,
            payment_method,
            payment_reference,
            status,
            notes,
            created_at,
            invoices(invoice_no, total_amount, customers(name))
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        console.error("Failed to fetch payments:", (error as { message: string })?.message ?? error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.map((p) => {
        const invoice = normalizeJoinSingle(p.invoices);
        return {
            ...p,
            invoices: invoice
                ? {
                    ...invoice,
                    customers: normalizeJoinSingle(invoice.customers),
                  }
                : null,
        };
    });
}

async function getOutstandingInvoices() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("invoices")
        .select(`
            id,
            invoice_no,
            total_amount,
            balance_due,
            due_date,
            status,
            customers(name, phone)
        `)
        .gt("balance_due", 0)
        .in("status", ["pending", "partial", "overdue"])
        .order("due_date", { ascending: true })
        .limit(50);

    return (data || []).map(i => ({
        ...i,
        customers: normalizeJoinSingle(i.customers),
    }));
}

async function getPaymentStats() {
    const supabase = await createClient();

    // Total received
    const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "completed");
    const totalReceived = (payments || []).reduce((sum, p) => sum + p.amount, 0);

    // Total outstanding
    const { data: invoices } = await supabase
        .from("invoices")
        .select("balance_due")
        .gt("balance_due", 0);
    const totalOutstanding = (invoices || []).reduce((sum, i) => sum + i.balance_due, 0);

    // Overdue count
    const { count: overdueCount } = await supabase
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("status", "overdue");

    return {
        totalReceived,
        totalOutstanding,
        overdueCount: overdueCount || 0,
    };
}

export default async function PaymentsPage() {
    const [payments, outstanding, stats] = await Promise.all([
        getPayments(),
        getOutstandingInvoices(),
        getPaymentStats(),
    ]);

    return (
        <>
            <V2Header title="Payments" section="Finance" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1400px] mx-auto">
                    <PaymentsClient
                        initialPayments={payments}
                        outstandingInvoices={outstanding}
                        stats={stats}
                    />
                </div>
            </main>
        </>
    );
}
