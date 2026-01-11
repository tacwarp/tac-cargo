import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentDetailClient } from "./_components/payment-detail-client";

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getPayment(id: string) {
  const supabase = await createClient();
  
  const { data: payment, error } = await supabase
    .from("payments")
    .select(`
      *,
      invoices:invoice_id(id, invoice_no, total_amount, balance_due, consignee_name)
    `)
    .eq("id", id)
    .single();

  if (error || !payment) {
    return null;
  }

  return payment;
}

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { id } = await params;
  const payment = await getPayment(id);

  if (!payment) {
    notFound();
  }

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PaymentDetailClient payment={payment} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
      </div>
    </div>
  );
}
