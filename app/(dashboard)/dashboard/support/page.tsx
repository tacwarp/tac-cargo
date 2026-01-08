"use client";

import React from "react";
import { V2Header } from "../_components/v2-header";
import { Search, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";

export default function V2SupportPage() {
    return (
        <>
            <V2Header title="Support" section="Management" />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth" id="main-scroll">
                <div className="max-w-4xl mx-auto mt-16">

                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">How can we help today?</h1>
                        <div className="max-w-lg mx-auto relative mt-8">
                            <Search className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                            <input type="text" placeholder="Search documentation, guides, or ask a question..." className="w-full bg-card/50 border border-border rounded-full pl-12 pr-6 py-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none backdrop-blur-sm transition-all shadow-xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <a href="#" className="group p-6 rounded-2xl border border-border bg-card/30 hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <BookOpen className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-2">Documentation</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Comprehensive guides for API integration, Dashboard usage, and tracking systems.</p>
                        </a>

                        <a href="#" className="group p-6 rounded-2xl border border-border bg-card/30 hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <MessageCircle className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-2">Live Chat</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Connect with our support team instantly. Available 24/7 for critical shipment issues.</p>
                        </a>

                        <a href="#" className="group p-6 rounded-2xl border border-border bg-card/30 hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <ShieldCheck className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-2">System Status</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Current system uptime: 99.99%. View active incidents and scheduled maintenance.</p>
                        </a>
                    </div>

                </div>
            </main>
        </>
    );
}
