"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiSearchLine,
  RiMapPinLine,
  RiFileListLine,
  RiLoader4Line,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageTrackerCard } from "@/components/ui/tracker-card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
    <section
      id="tracking"
      className="bg-background relative overflow-hidden py-24"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Ambient Glow */}
      <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 space-y-4 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Global Tracking <span className="text-primary">Protocol</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Real-time telemetry for your high-value consignments.
            </p>
          </motion.div>

          {/* Tracking Input Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-border dark:bg-card/40 dark:shadow-elevation-2 rounded-xl p-0 transition-all sm:p-8 dark:border dark:backdrop-blur-xl"
          >
            {/* Tabs */}
            <div className="mb-8 flex justify-center">
              <Tabs
                defaultValue="gps"
                value={trackingMode}
                onValueChange={(v: string) =>
                  setTrackingMode(v as "gps" | "custody")
                }
                className="w-auto"
              >
                <TabsList className="bg-secondary/50 grid w-full grid-cols-2">
                  <TabsTrigger
                    value="gps"
                    className="flex items-center gap-2 px-6"
                  >
                    <RiMapPinLine className="h-4 w-4" />
                    GPS Telemetry
                  </TabsTrigger>
                  <TabsTrigger
                    value="custody"
                    className="flex items-center gap-2 px-6"
                  >
                    <RiFileListLine className="h-4 w-4" />
                    Chain of Custody
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Input Group */}
            <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row">
              <div className="group relative flex-1">
                <RiSearchLine className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors" />
                <Input
                  placeholder="ENTER AWB NUMBER (E.G. TAC-02531)"
                  className="border-input bg-background/50 focus-visible:border-primary h-14 rounded-sm pl-10 font-mono tracking-wider uppercase transition-all focus-visible:border-2 focus-visible:ring-0"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-14 shrink-0 rounded-sm px-8 font-bold tracking-wide"
                onClick={handleSearch}
                disabled={isSearching || !trackingNumber}
                aria-label={
                  isSearching ? "Searching shipment" : "Trace shipment"
                }
              >
                {isSearching ? (
                  <RiLoader4Line className="h-5 w-5 animate-spin" />
                ) : (
                  "TRACE"
                )}
              </Button>
            </div>

            {/* Recent Queries - Scrollable */}
            <div className="mt-8 flex flex-col gap-2">
              <span className="text-muted-foreground px-1 font-mono text-[10px] tracking-widest uppercase">
                Recent Access:
              </span>
              <div className="scrollbar-hide mask-linear-fade -mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-2">
                {[
                  "TAC-02531",
                  "DEL-98234",
                  "IMP-45621",
                  "BOM-88219",
                  "NYC-10293",
                  "LHR-99283",
                ].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 shrink-0 cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[10px] transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    onClick={() => setTrackingNumber(example)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setTrackingNumber(example);
                      }
                    }}
                    role="button"
                    tabIndex={0}
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
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-widest text-success">
                SATELLITE UPLINK ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Tracking Result Modal */}
          {/* TODO: Replace with actual API data from useTracking hook for production */}
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent
              className="border-none bg-transparent p-0 shadow-none sm:max-w-md"
              aria-describedby={undefined}
            >
              <DialogTitle className="sr-only">
                Tracking Information for {trackingNumber}
              </DialogTitle>
              <PackageTrackerCard
                status="In Transit"
                packageNumber={trackingNumber}
                destination="Imphal, MN"
                destinationFlag={
                  <span className="text-xl" role="img" aria-label="India flag">
                    🇮🇳
                  </span>
                }
                date={`Expected: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}, 4:00 PM`}
                qrCodeValue={`https://tac.logistics/track/${encodeURIComponent(trackingNumber)}`}
                packageImage={
                  <div className="relative h-20 w-20">
                    <LottieContainer
                      src="/lottie/parcel.json"
                      className="h-full w-full"
                      loop={true}
                    />
                  </div>
                }
                className="border-primary/20 bg-background/95 dark:shadow-elevation-2 w-full shadow-none backdrop-blur-xl"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
