import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ManifestEditClient } from "./_components/manifest-edit-client";
import { normalizeJoinSingle } from "@/lib/utils";

interface ManifestEditPageProps {
  params: Promise<{ id: string }>;
}

async function getManifest(id: string) {
  const supabase = await createClient();
  
  const { data: manifest, error } = await supabase
    .from("manifests")
    .select(`
      *,
      origin_warehouse:warehouses!origin_warehouse_id(id, name, code),
      destination_warehouse:warehouses!destination_warehouse_id(id, name, code)
    `)
    .eq("id", id)
    .single();

  if (error || !manifest) {
    return null;
  }

  return {
    ...manifest,
    origin_warehouse: normalizeJoinSingle(manifest.origin_warehouse),
    destination_warehouse: normalizeJoinSingle(manifest.destination_warehouse),
  };
}

async function getWarehouses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("warehouses")
    .select("id, name, code")
    .eq("is_active", true)
    .order("name");
  return data || [];
}

export default async function ManifestEditPage({ params }: ManifestEditPageProps) {
  const { id } = await params;
  const [manifest, warehouses] = await Promise.all([
    getManifest(id),
    getWarehouses(),
  ]);

  if (!manifest) {
    notFound();
  }

  if (manifest.status === "completed") {
    notFound();
  }

  return (
    <Suspense fallback={<EditSkeleton />}>
      <ManifestEditClient manifest={manifest} warehouses={warehouses} />
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
