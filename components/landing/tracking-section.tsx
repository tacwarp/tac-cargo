"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiSearchLine, RiMapPinLine, RiFileListLine, RiLoader4Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageTrackerCard } from "@/components/ui/tracker-card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Truck } from "lucide-react";
import { LottieContainer } from "@/components/ui/lottie-container";

export function TrackingSection() {
  const [trackingMode, setTrackingMode] = useState<"gps" | "custody">("gps");
  const [trackingNumber, setTrackingNumber] = useState("TAC-8291"); // Prefilled dummy data
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = () => {
    if (!trackingNumber) return;
    setIsSearching(true);
    setShowResult(false);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <section id="tracking" className="py-24 relative overflow-hidden bg-background">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Global Tracking <span className="text-primary">Protocol</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Real-time telemetry for your high-value consignments.
            </p>
          </motion.div>

          {/* Tracking Input Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border-border dark:bg-card/40 dark:backdrop-blur-xl dark:border dark:shadow-elevation-2 p-0 sm:p-8 transition-all"
          >

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <Tabs defaultValue="gps" onValueChange={(v: string) => setTrackingMode(v as "gps" | "custody")} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                  <TabsTrigger value="gps" className="flex items-center gap-2 px-6">
                    <RiMapPinLine className="w-4 h-4" />
                    GPS Telemetry
                  </TabsTrigger>
                  <TabsTrigger value="custody" className="flex items-center gap-2 px-6">
                    <RiFileListLine className="w-4 h-4" />
                    Chain of Custody
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Input Group */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto items-stretch">
              <div className="relative flex-1 group">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="ENTER AWB NUMBER (E.G. TAC-02531)"
                  className="pl-10 h-14 uppercase font-mono tracking-wider border-input bg-background/50 focus-visible:ring-0 focus-visible:border-primary focus-visible:border-2 transition-all rounded-sm"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-14 px-8 font-bold tracking-wide shrink-0 rounded-sm"
                onClick={handleSearch}
                disabled={isSearching || !trackingNumber}
                aria-label={isSearching ? "Searching shipment" : "Trace shipment"}
              >
                {isSearching ? <RiLoader4Line className="w-5 h-5 animate-spin" /> : "TRACE"}
              </Button>
            </div>

            {/* Recent Queries - Scrollable */}
            <div className="flex flex-col gap-2 mt-8">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">Recent Access:</span>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mask-linear-fade">
                {['TAC-02531', 'DEL-98234', 'IMP-45621', 'BOM-88219', 'NYC-10293', 'LHR-99283'].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="rounded-sm font-mono text-[10px] cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all shrink-0 py-1.5 px-3"
                    onClick={() => setTrackingNumber(example)}
                    aria-label={`Search for example tracking number ${example}`}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-emerald-500 tracking-widest font-semibold">SATELLITE UPLINK ACTIVE</span>
            </div>
          </motion.div>

          {/* Tracking Result Modal */}
          {/* TODO: Replace with actual API data from useTracking hook for production */}
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0" aria-describedby={undefined}>
              <DialogTitle className="sr-only">Tracking Information for {trackingNumber}</DialogTitle>
              <PackageTrackerCard
                status="In Transit"
                packageNumber={trackingNumber}
                destination="Imphal, MN"
                destinationFlag={<span className="text-xl" role="img" aria-label="India flag">🇮🇳</span>}
                date={`Expected: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}, 4:00 PM`}
                qrCodeValue={`https://tac.logistics/track/${encodeURIComponent(trackingNumber)}`}
                packageImage={
                  <div className="w-20 h-20 relative">
                    <LottieContainer
                      src="/lottie/parcel.json"
                      className="w-full h-full"
                      loop={true}
                    />
                  </div>
                }
                className="w-full border-primary/20 bg-background/95 backdrop-blur-xl dark:shadow-elevation-2 shadow-none"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
