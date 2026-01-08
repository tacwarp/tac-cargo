"use client";

import React, { useState, useTransition } from "react";
import { 
    User, 
    Shield, 
    Bell,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: UserRole;
    preferences: { theme?: string; notifications?: boolean } | null;
    warehouse_id: string | null;
    organization_id: string | null;
    warehouses: { name: string; code: string } | null;
    organizations: { name: string } | null;
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface SettingsClientProps {
    profile: Profile | null;
    warehouses: Warehouse[];
}

type TabType = "account" | "security" | "notifications";

export function SettingsClient({ profile, warehouses }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>("account");
    const [isPending, startTransition] = useTransition();
    
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        warehouse_id: profile?.warehouse_id || "",
        notifications: profile?.preferences?.notifications ?? true,
        theme: profile?.preferences?.theme || "system",
    });

    const handleSave = async () => {
        startTransition(async () => {
            const supabase = createClient();
            
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    warehouse_id: formData.warehouse_id || null,
                    preferences: {
                        theme: formData.theme,
                        notifications: formData.notifications,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq("id", profile?.id);

            if (error) {
                toast.error("Failed to save settings");
            } else {
                toast.success("Settings saved");
            }
        });
    };

    if (!profile) {
        return (
            <GlassPanel className="p-8 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground mb-2">Not Logged In</h2>
                <p className="text-sm text-muted-foreground">Please log in to access settings</p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="p-8 bg-card/40">
            <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border mb-8">
                <TabButton 
                    active={activeTab === "account"} 
                    onClick={() => setActiveTab("account")}
                    icon={User}
                >
                    Account
                </TabButton>
                <TabButton 
                    active={activeTab === "security"} 
                    onClick={() => setActiveTab("security")}
                    icon={Shield}
                >
                    Security
                </TabButton>
                <TabButton 
                    active={activeTab === "notifications"} 
                    onClick={() => setActiveTab("notifications")}
                    icon={Bell}
                >
                    Notifications
                </TabButton>
            </div>

            {/* Account Tab */}
            {activeTab === "account" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input 
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input 
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={profile.email} disabled className="opacity-50" />
                            <p className="text-[10px] text-muted-foreground">Contact admin to change email</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={profile.role} disabled className="opacity-50 capitalize" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Default Warehouse</Label>
                            <select
                                value={formData.warehouse_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, warehouse_id: e.target.value }))}
                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground"
                            >
                                <option value="">No default</option>
                                {warehouses.map((w) => (
                                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Organization</Label>
                            <Input 
                                value={profile.organizations?.name || "—"} 
                                disabled 
                                className="opacity-50" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-2">
                            {["light", "dark", "system"].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => setFormData(prev => ({ ...prev, theme }))}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm capitalize transition-colors",
                                        formData.theme === theme
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-2">Password</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Password changes are handled through Supabase Auth
                        </p>
                        <Button variant="outline" size="sm" disabled>
                            Change Password
                        </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-card border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Add an extra layer of security to your account
                        </p>
                        <Button variant="outline" size="sm" disabled>
                            Enable 2FA
                        </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-card border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-2">Sessions</h3>
                        <p className="text-xs text-muted-foreground">
                            You are currently logged in from this device
                        </p>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                        <div>
                            <h3 className="text-sm font-medium text-foreground">Email Notifications</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Receive email notifications for important updates
                            </p>
                        </div>
                        <Switch 
                            checked={formData.notifications}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border opacity-50">
                        <div>
                            <h3 className="text-sm font-medium text-foreground">Push Notifications</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Receive browser push notifications
                            </p>
                        </div>
                        <Switch disabled />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border opacity-50">
                        <div>
                            <h3 className="text-sm font-medium text-foreground">SMS Notifications</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Receive SMS for critical alerts
                            </p>
                        </div>
                        <Switch disabled />
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="pt-8 mt-8 border-t border-border flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={isPending}
                    className="gap-2"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </GlassPanel>
    );
}

function TabButton({ 
    active, 
    onClick, 
    icon: Icon,
    children 
}: { 
    active: boolean; 
    onClick: () => void;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "pb-3 text-sm font-medium transition-colors flex items-center gap-2",
                active 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
            {children}
        </button>
    );
}
