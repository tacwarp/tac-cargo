"use client";

import React, { useState, useTransition } from "react";
import {
    Search,
    Plus,
    Phone,
    Mail,
    MapPin,
    User,
    Building2,
    Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/app/actions/customers";
import type { CustomerType } from "@/types/database";

interface Customer {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    gst_number: string | null;
    customer_type: CustomerType;
    credit_limit: number;
    created_at: string;
}

interface CustomerStats {
    total: number;
    vip: number;
    corporate: number;
    regular: number;
}

interface CustomersClientProps {
    initialCustomers: Customer[];
    stats: CustomerStats;
}

const typeConfig: Record<CustomerType, { label: string; color: string; icon: React.ElementType; gradient: string }> = {
    regular: { label: "Regular", color: "text-muted-foreground", icon: User, gradient: "from-zinc-500 to-zinc-600" },
    corporate: { label: "Corporate", color: "text-primary", icon: Building2, gradient: "from-primary to-primary/60" },
    vip: { label: "VIP", color: "text-warning", icon: Crown, gradient: "from-warning to-warning/60" },
};

export function CustomersClient({ initialCustomers, stats }: CustomersClientProps) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<CustomerType | "all">("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);


    const filteredCustomers = customers.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || c.customer_type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Customers" value={stats.total} color="text-foreground" />
                <StatCard label="VIP" value={stats.vip} color="text-warning" />
                <StatCard label="Corporate" value={stats.corporate} color="text-primary" />
                <StatCard label="Regular" value={stats.regular} color="text-muted-foreground" />
            </div>

            {/* Search & Actions */}
            <GlassPanel className="p-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as CustomerType | "all")}
                        className="bg-card border border-border rounded px-4 py-2 text-sm text-foreground"
                    >
                        <option value="all">All Types</option>
                        {Object.entries(typeConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Customer</DialogTitle>
                                <DialogDescription>Fill in the details below to add a new customer.</DialogDescription>
                            </DialogHeader>
                            <CreateCustomerForm
                                onSuccess={(newCustomer) => {
                                    setCustomers(prev => [newCustomer as Customer, ...prev]);
                                    setIsCreateOpen(false);
                                    toast.success("Customer added");
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </GlassPanel>

            {/* Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCustomers.length === 0 ? (
                    <GlassPanel className="col-span-full p-12 text-center">
                        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-muted-foreground">No customers found</div>
                    </GlassPanel>
                ) : (
                    filteredCustomers.map((customer) => {
                        const type = typeConfig[customer.customer_type] || typeConfig.regular;
                        const TypeIcon = type.icon;

                        return (
                            <div
                                key={customer.id}
                                className="group bg-card/40 border border-border rounded-xl p-6 flex flex-col items-center text-center hover:bg-card/60 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full mb-4 p-[2px] shadow-lg transition-shadow",
                                    `bg-gradient-to-tr ${type.gradient}`
                                )}>
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-xl font-bold text-foreground">
                                        {getInitials(customer.name)}
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-foreground mb-1 truncate w-full">
                                    {customer.name}
                                </h3>
                                <div className="flex items-center gap-1 mb-4">
                                    <TypeIcon className={cn("w-3 h-3", type.color)} />
                                    <span className={cn("text-xs", type.color)}>{type.label}</span>
                                </div>

                                <div className="w-full space-y-2 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        <span className="truncate">{customer.phone}</span>
                                    </div>
                                    {customer.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                    )}
                                    {customer.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{customer.city}, {customer.state}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 w-full mt-auto">
                                    <a
                                        href={`tel:${customer.phone}`}
                                        className="flex-1 py-2 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 transition-colors text-center"
                                    >
                                        Call
                                    </a>
                                    {customer.email && (
                                        <a
                                            href={`mailto:${customer.email}`}
                                            className="flex-1 py-2 rounded-lg border border-border text-muted-foreground text-xs font-bold hover:bg-muted/50 transition-colors text-center"
                                        >
                                            Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <GlassPanel className="p-4 text-center">
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
        </GlassPanel>
    );
}

function CreateCustomerForm({ onSuccess }: { onSuccess: (customer: unknown) => void }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        contact_person: "",
        contact_email: "",
        contact_phone: "",
        billing_address: "",
        city: "",
        state: "",
        pincode: "",
        gst_number: "",
        credit_limit: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createCustomer({
                ...formData,
                contact_person: formData.contact_person || formData.name,
            });
            if (result.success) {
                onSuccess(result.data);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label>Company / Customer Name</Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="+919876543210"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Address</Label>
                <Input
                    value={formData.billing_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, billing_address: e.target.value }))}
                    required
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>GST Number (Optional)</Label>
                    <Input
                        value={formData.gst_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Credit Limit</Label>
                    <Input
                        type="number"
                        value={formData.credit_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, credit_limit: parseInt(e.target.value) || 0 }))}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Customer"}
                </Button>
            </div>
        </form>
    );
}
