import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { CustomersClient } from "./_components/customers-client";

async function getCustomers() {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("customers")
        .select(`
            id,
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            gst_number,
            customer_type,
            credit_limit,
            created_at
        `)
        .order("name")
        .limit(100);

    if (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }

    return data || [];
}

async function getCustomerStats() {
    const supabase = await createClient();
    
    const { count: totalCount } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true });

    const { count: vipCount } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("customer_type", "vip");

    const { count: corporateCount } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("customer_type", "corporate");

    return {
        total: totalCount || 0,
        vip: vipCount || 0,
        corporate: corporateCount || 0,
        regular: (totalCount || 0) - (vipCount || 0) - (corporateCount || 0),
    };
}

export default async function CustomersPage() {
    const [customers, stats] = await Promise.all([
        getCustomers(),
        getCustomerStats(),
    ]);

    return (
        <>
            <V2Header title="Customers" section="Management" />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto">
                    <CustomersClient 
                        initialCustomers={customers}
                        stats={stats}
                    />
                </div>
            </main>
        </>
    );
}
