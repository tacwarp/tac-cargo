/**
 * Audit Logging Service
 * Tracks all entity changes for compliance and security
 */

import { createClient } from "@/lib/supabase/server";

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'PRINT' | 'DOWNLOAD';
export type EntityType = 'invoice' | 'shipment' | 'manifest' | 'customer' | 'payment' | 'user' | 'organization';

export interface AuditLogData {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 * NOTE: Audit logging is handled automatically by database triggers.
 * This function is kept for manual logging if needed, but is disabled by default.
 */
export async function logAuditEvent(data: AuditLogData): Promise<void> {
  // Audit logging is handled by database triggers automatically
  // No manual insertion needed to avoid schema conflicts
  // The trigger in migration 006 handles all INSERT/UPDATE/DELETE operations
  
  // Log for debugging purposes only
  if (process.env.NODE_ENV === 'development') {
    console.log('Audit event (handled by trigger):', {
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
    });
  }
  
  return;
}

/**
 * Get audit logs for an entity
 */
export async function getEntityAuditLogs(
  entityType: EntityType,
  entityId: string
): Promise<any[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        *,
        profiles:user_id(id, full_name, email)
      `)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Get audit logs error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Get audit logs error:", err);
    return [];
  }
}

/**
 * Get recent audit logs for organization
 */
export async function getRecentAuditLogs(limit: number = 50): Promise<any[]> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        *,
        profiles:user_id(id, full_name, email)
      `)
      .eq("organization_id", profile?.organization_id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Get recent audit logs error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Get recent audit logs error:", err);
    return [];
  }
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogs(
  startDate: Date,
  endDate: Date
): Promise<string> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .eq("organization_id", profile?.organization_id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Convert to CSV
    const headers = ["Timestamp", "User", "Action", "Entity Type", "Entity ID", "IP Address"];
    const rows = data?.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.profiles?.full_name || log.profiles?.email || "Unknown",
      log.action,
      log.entity_type,
      log.entity_id,
      log.ip_address || "N/A",
    ]) || [];

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    return csv;
  } catch (err) {
    console.error("Export audit logs error:", err);
    throw err;
  }
}
