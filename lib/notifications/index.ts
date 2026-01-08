import { createClient } from "@/lib/supabase/server";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
}

export interface NotificationChannel {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  push?: boolean;
  inApp?: boolean;
}

export async function createNotification(
  payload: NotificationPayload,
): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", payload.userId)
      .single();

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: payload.userId,
        organization_id: profile?.organization_id,
        title: payload.title,
        message: payload.message,
        type: payload.type || "info",
        entity_type: payload.entityType,
        entity_id: payload.entityId,
        action_url: payload.actionUrl,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create notification:", error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Notification creation error:", error);
    return null;
  }
}

export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  } catch {
    return false;
  }
}

export async function markAllAsRead(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_read", false);

    return !error;
  } catch {
    return false;
  }
}

export async function getUserNotifications(
  userId: string,
  options: { limit?: number; unreadOnly?: boolean } = {},
) {
  try {
    const supabase = await createClient();
    const { limit = 20, unreadOnly = false } = options;

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}
