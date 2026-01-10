import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { SettingsClient } from "./_components/settings-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getUserProfile() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            id,
            email,
            full_name,
            phone,
            role,
            preferences,
            warehouse_id,
            organization_id,
            warehouses(name, code),
            organizations(name)
        `)
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    return {
        ...profile,
        warehouses: normalizeJoinSingle(profile.warehouses),
        organizations: normalizeJoinSingle(profile.organizations),
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

export default async function SettingsPage() {
    const [profile, warehouses] = await Promise.all([
        getUserProfile(),
        getWarehouses(),
    ]);

    return (
        <>
            <V2Header title="Settings" section="Management" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-3xl mx-auto">
                    <SettingsClient profile={profile} warehouses={warehouses} />
                </div>
            </main>
        </>
    );
}
