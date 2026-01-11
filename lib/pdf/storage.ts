"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Upload PDF to Supabase Storage
 * Returns the public URL of the uploaded file
 */
export async function uploadPDFToStorage(
  buffer: Buffer,
  fileName: string,
  bucketName: "invoices" | "labels" | "manifests" | "documents",
  organizationId: string
): Promise<{ url: string; path: string } | null> {
  try {
    const supabase = await createClient();

    // Create folder structure: {bucket}/{org_id}/{year}/{month}/{filename}
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    
    const filePath = `${organizationId}/${year}/${month}/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Upload PDF error:", error);
    return null;
  }
}

/**
 * Delete PDF from Supabase Storage
 */
export async function deletePDFFromStorage(
  bucketName: "invoices" | "labels" | "manifests" | "documents",
  filePath: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("Storage delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete PDF error:", error);
    return false;
  }
}

/**
 * Get signed URL for private PDF access
 */
export async function getSignedPDFUrl(
  bucketName: "invoices" | "labels" | "manifests" | "documents",
  filePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Get signed URL error:", error);
    return null;
  }
}
