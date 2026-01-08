"use client";

import React from "react";
import { V2Header } from "../_components/v2-header";
import { Frown, Meh, Smile } from "lucide-react";

export default function V2FeedbackPage() {
    return (
        <>
            <V2Header title="Feedback" section="Management" />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth" id="main-scroll">
                <div className="max-w-lg mx-auto text-center mt-20">
                    <h2 className="text-2xl font-bold text-foreground mb-8">How is your experience?</h2>

                    <div className="flex justify-center gap-8 mb-10">
                        <button className="flex flex-col items-center gap-3 group">
                            <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-3xl group-hover:bg-destructive/20 group-hover:border-destructive group-hover:shadow-[0_0_20px_-5px_var(--destructive)] transition-all bg-card">
                                <Frown className="text-muted-foreground group-hover:text-destructive w-8 h-8 transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-destructive transition-colors">Bad</span>
                        </button>
                        <button className="flex flex-col items-center gap-3 group">
                            <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-3xl group-hover:bg-warning/20 group-hover:border-warning group-hover:shadow-[0_0_20px_-5px_var(--warning)] transition-all bg-card">
                                <Meh className="text-muted-foreground group-hover:text-warning w-8 h-8 transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-warning transition-colors">Okay</span>
                        </button>
                        <button className="flex flex-col items-center gap-3 group">
                            <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-3xl group-hover:bg-success/20 group-hover:border-success group-hover:shadow-[0_0_20px_-5px_var(--success)] transition-all bg-card">
                                <Smile className="text-muted-foreground group-hover:text-success w-8 h-8 transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-success transition-colors">Good</span>
                        </button>
                    </div>

                    <div className="bg-card/50 p-6 rounded-2xl border border-border">
                        <textarea placeholder="Tell us more about your experience..." className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground h-32 focus:border-primary outline-none resize-none mb-4 placeholder:text-muted-foreground transition-colors"></textarea>
                        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg">Send Feedback</button>
                    </div>
                </div>
            </main>
        </>
    );
}
