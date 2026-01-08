"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrackSearchPage() {
  const [awb, setAwb] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanAwb = awb
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (!cleanAwb) {
      setError("Please enter an AWB number");
      return;
    }

    if (cleanAwb.length < 3 || cleanAwb.length > 20) {
      setError("AWB number must be 3-20 characters");
      return;
    }

    router.push(`/track/${encodeURIComponent(cleanAwb)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            TAC Cargo
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-3 text-3xl font-bold">Track Your Shipment</h1>
            <p className="mx-auto max-w-md text-muted-foreground">
              Enter your AWB (Air Waybill) number to get real-time tracking
              updates on your shipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={awb}
                onChange={(e) => {
                  setAwb(e.target.value);
                  setError("");
                }}
                placeholder="Enter AWB number (e.g., TAC123456)"
                className="w-full rounded-xl border border-border bg-card py-4 pr-4 pl-12 font-mono text-lg transition-all placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Track Shipment
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="mt-1 text-xs text-muted-foreground">Real-time Updates</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="mt-1 text-xs text-muted-foreground">Accurate Tracking</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-2xl font-bold text-primary">Fast</p>
              <p className="mt-1 text-xs text-muted-foreground">Instant Results</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} TAC Cargo. Imphal-Delhi Logistics
            Corridor.
          </p>
        </div>
      </footer>
    </div>
  );
}
