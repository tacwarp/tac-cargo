import crypto from "node:crypto";
import { createClient } from "@/lib/supabase/server";

const API_KEY_PREFIX = "tac_";
const API_KEY_LENGTH = 32;

export function generateApiKey(): {
  key: string;
  hash: string;
  prefix: string;
} {
  const random = crypto.randomBytes(API_KEY_LENGTH).toString("base64url");
  const key = `${API_KEY_PREFIX}${random}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const prefix = key.slice(0, 12);

  return { key, hash, prefix };
}

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function validateApiKey(key: string): Promise<{
  valid: boolean;
  organizationId?: string;
  scopes?: string[];
  error?: string;
}> {
  if (!key?.startsWith(API_KEY_PREFIX)) {
    return { valid: false, error: "Invalid API key format" };
  }

  try {
    const supabase = await createClient();
    const hash = hashApiKey(key);

    const { data: apiKey, error } = await supabase
      .from("api_keys")
      .select("organization_id, scopes, expires_at, is_active")
      .eq("key_hash", hash)
      .single();

    if (error || !apiKey) {
      return { valid: false, error: "API key not found" };
    }

    if (!apiKey.is_active) {
      return { valid: false, error: "API key is inactive" };
    }

    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return { valid: false, error: "API key has expired" };
    }

    // Update last used timestamp
    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("key_hash", hash);

    return {
      valid: true,
      organizationId: apiKey.organization_id,
      scopes: apiKey.scopes || ["read"],
    };
  } catch (error) {
    console.error("API key validation error:", error instanceof Error ? error.message : "Unknown error");
    return { valid: false, error: "Validation failed" };
  }
}

export function hasScope(scopes: string[], required: string): boolean {
  return scopes.includes(required) || scopes.includes("*");
}

export async function createApiKeyForOrg(
  organizationId: string,
  name: string,
  scopes: string[] = ["read"],
  expiresInDays?: number,
): Promise<{ key: string; id: string } | null> {
  try {
    const supabase = await createClient();
    const { key, hash, prefix } = generateApiKey();

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        organization_id: organizationId,
        name,
        key_hash: hash,
        key_prefix: prefix,
        scopes,
        expires_at: expiresAt,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create API key:", error instanceof Error ? { code: (error as { code?: string }).code } : "Unknown error");
      return null;
    }

    return { key, id: data.id };
  } catch (error) {
    console.error("API key creation error:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}
