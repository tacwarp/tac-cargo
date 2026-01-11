import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvoiceViewer } from "@/components/invoice/amazon-style/invoice-viewer";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getInvoice(id: string) {
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customers(id, name, phone, email, address, city, state, pincode, gst_number),
      shipments:shipment_id(id, reference, status, pieces, weight_kg),
      invoice_items(*)
    `)
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return null;
  }

  return invoice;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  return (
    <Suspense fallback={<InvoiceDetailSkeleton />}>
      <InvoiceViewer invoice={invoice} />
    </Suspense>
  );
}

function InvoiceDetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48 bg-muted rounded" />
        <div className="h-48 bg-muted rounded" />
      </div>
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}
