import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvoiceEditClient } from "./_components/invoice-edit-client";

interface InvoiceEditPageProps {
  params: Promise<{ id: string }>;
}

async function getInvoice(id: string) {
  const supabase = await createClient();
  
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customers(id, name, phone, email, address, city, state, pincode, gst_number),
      invoice_items(*)
    `)
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return null;
  }

  return invoice;
}

export default async function InvoiceEditPage({ params }: InvoiceEditPageProps) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  // Don't allow editing cancelled or paid invoices
  if (invoice.status === "cancelled" || invoice.status === "paid") {
    notFound();
  }

  return (
    <Suspense fallback={<EditSkeleton />}>
      <InvoiceEditClient invoice={invoice} />
    </Suspense>
  );
}

function EditSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
    </div>
  );
}
