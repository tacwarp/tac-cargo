import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerEditClient } from "./_components/customer-edit-client";

interface CustomerEditPageProps {
  params: Promise<{ id: string }>;
}

async function getCustomer(id: string) {
  const supabase = await createClient();
  
  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) {
    return null;
  }

  return customer;
}

export default async function CustomerEditPage({ params }: CustomerEditPageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <Suspense fallback={<EditSkeleton />}>
      <CustomerEditClient customer={customer} />
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
