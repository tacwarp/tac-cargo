import { createClient } from "@/lib/supabase/server";
import { unauthorizedResponse } from "./response";
import { NextResponse } from "next/server";

export interface AuthContext {
  user: {
    id: string;
    email: string | undefined;
    role: string;
  };
  organizationId: string | null;
}

export async function withAuth(
  handler: (context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return unauthorizedResponse();
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    const context: AuthContext = {
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || "user",
      },
      organizationId: profile?.organization_id || null,
    };

    return handler(context);
  } catch (error) {
    console.error("Auth error:", error);
    return unauthorizedResponse();
  }
}

export async function getAuthContext(): Promise<AuthContext | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    return {
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || "user",
      },
      organizationId: profile?.organization_id || null,
    };
  } catch {
    return null;
  }
}

export function requireRole(
  context: AuthContext,
  allowedRoles: string[],
): boolean {
  return allowedRoles.includes(context.user.role);
}
