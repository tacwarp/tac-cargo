"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Truck, PackageCheck, Bike } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const competencies = [
  {
    id: "air-cargo",
    title: "Global Air Freight",
    description:
      "High-speed logistics for time-critical consignments across international borders.",
    image: "/images/air-cargo.png",
    icon: Plane,
    link: "/services/air",
    color: "from-blue-500/80 to-indigo-600/80",
  },
  {
    id: "packing",
    title: "Secure Packaging",
    description:
      "Military-grade packaging protocols ensuring zero-damage transit verification.",
    image: "/images/packing.png",
    icon: PackageCheck,
    link: "/services/packing",
    color: "from-amber-500/80 to-orange-600/80",
  },
  {
    id: "ebike",
    title: "Eco Last Mile",
    description:
      "Sustainable urban delivery network utilizing electric mobility solutions.",
    image: "/images/ebike-pick-and-drop.png",
    icon: Bike,
    link: "/services/last-mile",
    color: "from-emerald-500/80 to-green-600/80",
  },
  {
    id: "surface",
    title: "Surface Logistics",
    description:
      "Cost-optimized heavy haulage and nationwide network distribution.",
    image: "/images/surface-cargo.png",
    icon: Truck,
    link: "/services/surface",
    color: "from-slate-700/80 to-gray-900/80",
  },
];

export function CoreCompetencies() {
  const [activeId, setActiveId] = useState<string | null>("air-cargo");

  return (
    <section className="bg-background relative overflow-hidden py-24">
      {/* Subtle background mesh */}
      <div className="from-primary/5 via-background to-background absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-5xl font-bold tracking-tight"
          >
            Core <span className="text-gradient-primary">Competencies</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-xl leading-relaxed font-light"
          >
            We don&apos;t just move cargo. We engineer supply chains with distinct
            operational pillars designed for speed, security, and
            sustainability.
          </motion.p>
        </div>

        <div
          className="flex h-[600px] flex-col gap-4 lg:h-[500px] lg:flex-row"
          role="listbox"
          aria-label="Core competencies selection"
          aria-activedescendant={`competency-${activeId}`}
        >
          {competencies.map((item) => (
            <CompetencyCard
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompetencyCard({
  item,
  isActive,
  onClick,
}: {
  item: (typeof competencies)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      id={`competency-${item.id}`}
      role="option"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-label={`${item.title}${isActive ? " (selected)" : ""}`}
      className={cn(
        "group focus-visible:ring-primary relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive
          ? "flex-[3] lg:flex-[3]"
          : "flex-[1] lg:flex-[1] hover:lg:flex-[1.2]",
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-700",
            isActive ? "scale-100" : "scale-110 grayscale hover:grayscale-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
            isActive
              ? "from-black/90 via-black/40 to-transparent opacity-80"
              : "from-black/80 via-black/20 to-transparent opacity-60",
          )}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        {/* Collapsed State Title (Vertical on desktop when inactive) */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 flex items-center justify-center whitespace-nowrap transition-all duration-500",
            isActive
              ? "-translate-x-1/2 -translate-y-1/2 scale-90 opacity-0"
              : "-translate-x-1/2 -translate-y-1/2 -rotate-90 opacity-100",
          )}
        >
          <span className="text-xl font-bold tracking-widest text-white/90 uppercase drop-shadow-md">
            {item.title}
          </span>
        </div>

        {/* Expanded Content */}
        <div
          className={cn(
            "transform transition-all duration-500",
            isActive
              ? "translate-y-0 opacity-100 delay-100"
              : "translate-y-8 opacity-0",
          )}
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="mb-3 text-3xl font-bold text-white">{item.title}</h3>
          <p className="mb-6 max-w-md text-lg leading-relaxed font-light text-white/80">
            {item.description}
          </p>
          <Link
            href={item.link}
            className="group/btn hover:text-primary inline-flex items-center gap-2 text-sm font-medium text-white transition-colors"
          >
            Explore Vertical{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Active Border/Glow */}
      {isActive && (
        <motion.div
          layoutId="active-border"
          className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-white/20"
        />
      )}
    </motion.div>
  );
}
