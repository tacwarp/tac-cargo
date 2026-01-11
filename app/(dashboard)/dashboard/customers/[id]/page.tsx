import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerDetailClient } from "./_components/customer-detail-client";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getCustomer(id: string) {
  const supabase = await createClient();
  
  const { data: customer, error } = await supabase
    .from("customers")
    .select(`
      *,
      shipments(id, reference, status, created_at),
      invoices(id, invoice_no, status, total_amount, created_at)
    `)
    .eq("id", id)
    .single();

  if (error || !customer) {
    return null;
  }

  return customer;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <CustomerDetailClient customer={customer} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
      </div>
    </div>
  );
}
