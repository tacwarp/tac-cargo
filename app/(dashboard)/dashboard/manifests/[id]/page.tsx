import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ManifestDetailClient } from "./_components/manifest-detail-client";
import { normalizeJoinSingle } from "@/lib/utils";

interface ManifestDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getManifest(id: string) {
  const supabase = await createClient();
  
  const { data: manifest, error } = await supabase
    .from("manifests")
    .select(`
      *,
      origin_warehouse:warehouses!origin_warehouse_id(id, name, code, city),
      destination_warehouse:warehouses!destination_warehouse_id(id, name, code, city),
      shipments(id, reference, status, consignee_name, pieces, weight_kg)
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

export default async function ManifestDetailPage({ params }: ManifestDetailPageProps) {
  const { id } = await params;
  const manifest = await getManifest(id);

  if (!manifest) {
    notFound();
  }

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ManifestDetailClient manifest={manifest} />
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
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}
