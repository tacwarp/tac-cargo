import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { InvoicesClient } from "./_components/invoices-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getInvoices() {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("invoices")
        .select(`
            id,
            invoice_no,
            type,
            status,
            awb_no,
            consignee_name,
            consignee_address,
            consignee_city,
            consignee_state,
            consignee_pincode,
            subtotal,
            total_tax,
            total_amount,
            balance_due,
            invoice_date,
            due_date,
            pdf_url,
            sent_via_whatsapp_at,
            created_at,
            customers(id, name, phone, email),
            shipments(id, reference, pieces)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Failed to fetch invoices:", JSON.stringify(error, null, 2));
        // Return empty array to prevent page crash - RLS might be blocking access
        return [];
    }
    
    if (!data) {
        return [];
    }

    return (data || []).map(i => ({
        ...i,
        customers: normalizeJoinSingle(i.customers),
        shipments: normalizeJoinSingle(i.shipments),
    }));
}

async function getShipmentsWithoutInvoice() {
    const supabase = await createClient();
    
    // Get shipments that don't have a customer invoice yet
    const { data: invoicedShipments } = await supabase
        .from("invoices")
        .select("shipment_id")
        .eq("type", "customer");
    
    const invoicedIds = (invoicedShipments || []).map(i => i.shipment_id).filter(Boolean);
    
    let query = supabase
        .from("shipments")
        .select(`
            id,
            reference,
            consignee_name,
            pieces,
            weight_kg,
            customers(name, phone)
        `)
        .order("created_at", { ascending: false })
        .limit(50);
    
    if (invoicedIds.length > 0) {
        query = query.not("id", "in", `(${invoicedIds.join(",")})`);
    }
    
    const { data } = await query;
    return (data || []).map(s => ({
        ...s,
        customers: normalizeJoinSingle(s.customers),
    }));
}

export default async function InvoicesPage() {
    const [invoices, shipmentsWithoutInvoice] = await Promise.all([
        getInvoices(),
        getShipmentsWithoutInvoice(),
    ]);

    return (
        <>
            <V2Header title="Invoices" section="Finance" />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto">
                    <InvoicesClient 
                        initialInvoices={invoices}
                        shipmentsWithoutInvoice={shipmentsWithoutInvoice}
                    />
                </div>
            </main>
        </>
    );
}
