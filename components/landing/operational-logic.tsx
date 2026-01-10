"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types for our bento grid items
export type BentoItem = {
  id: string;
  type: "feature" | "chat" | "partners";
  title?: string;
  description?: string;
  image?: string;
  className?: string;
  content?: ReactNode;
};

// Props for our base BentoGrid component
interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

// Props for each bento item
interface BentoItemProps {
  item: BentoItem;
  className?: string;
}

export function OperationalLogic() {
  const items: BentoItem[] = [
    {
      id: "1",
      type: "feature",
      title: "Real-Time Fleet Intelligence",
      description:
        "Transform raw telemetry data into crisp visuals that instant logistics insights.",
      image: "/images/operational-visibility.png",
    },
    {
      id: "2",
      type: "chat",
      content: <ChatMessaging />,
    },
    {
      id: "3",
      type: "partners",
      title: "Global Connectivity",
      description:
        "Integrate seamlessly with major carriers and customs platforms for unified shipping.",
      content: <CompanyLogos />,
    },
  ];

  return (
    <section className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-24">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 container mx-auto space-y-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <div className="bg-primary h-px w-8" />
            <span className="text-primary font-mono text-sm tracking-widest uppercase">
              Operational Logic
            </span>
            <div className="bg-primary h-px w-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
          >
            Precision from <span className="text-primary">Origin</span> to{" "}
            <span className="text-primary">Destination</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Our autonomous logistics protocol ensures transparency and security
            at every node of the supply chain.
          </motion.p>
        </div>

        <BentoGrid items={items} />
      </div>
    </section>
  );
}

// Base BentoGrid component
export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className={cn(
              "row-span-1",
              item.type === "feature" && "col-span-1 md:col-span-2",
              item.className,
            )}
          >
            <BentoGridItem item={item} />
          </div>
        );
      })}
    </div>
  );
}

// Individual BentoGridItem component
function BentoGridItem({ item, className }: BentoItemProps) {
  const { type, title, description, image, content } = item;

  // Different layouts based on item type
  switch (type) {
    case "feature":
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "group bg-primary/5 border-border relative flex h-[400px] flex-col overflow-hidden rounded-xl border p-8 shadow-sm transition-shadow hover:shadow-md md:flex-row dark:bg-neutral-900",
            className,
          )}
        >
          <div className="z-10 flex flex-col justify-center md:w-1/2">
            <span className="text-primary mb-2 text-xs font-medium uppercase">
              Operational Visibility
            </span>
            <h2 className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-md text-sm text-balance">
              {description}
            </p>
          </div>

          {image && (
            <div className="top-0 right-0 flex h-full items-center justify-center md:w-1/2">
              <div className="relative h-full w-full">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-0"
                >
                  <div className="relative top-10 left-10 h-full w-full">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt="visualise"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="dark:shadow-primary/20 rounded-md object-cover shadow-xl shadow-black/10"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[2rem] w-full bg-gradient-to-t to-transparent" />
        </motion.div>
      );

    case "chat":
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "group bg-card border-border relative flex h-[400px] flex-col overflow-hidden rounded-xl border p-8 shadow-sm transition-shadow hover:shadow-md",
            className,
          )}
        >
          <div className="z-10">
            <span className="text-primary mb-2 flex items-center justify-center p-2 text-xs font-medium uppercase">
              Intelligent Dispatch
            </span>
          </div>

          <div className="relative flex-1">{content}</div>
          <div className="from-background/50 pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[2rem] w-full bg-gradient-to-t to-transparent" />
        </motion.div>
      );

    case "partners":
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "group bg-card border-border relative flex h-[400px] flex-col overflow-hidden rounded-xl border p-8 shadow-sm transition-shadow hover:shadow-md",
            className,
          )}
        >
          <div className="relative flex flex-1 items-center justify-center">
            {content}
            <div className="from-card pointer-events-none absolute inset-y-0 left-0 z-[100] h-full w-10 bg-gradient-to-r to-transparent" />
            <div className="from-card pointer-events-none absolute inset-y-0 right-0 z-[100] h-full w-10 bg-gradient-to-l to-transparent" />
          </div>

          <div className="z-10 mt-4">
            <span className="text-primary text-xs font-medium uppercase">
              Integration
            </span>
            <h3 className="text-foreground mb-2 text-2xl font-bold text-balance">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm text-balance">
              {description}
            </p>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}

// Company logos component for the partners section
export function CompanyLogos() {
  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex items-center justify-center gap-8"
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {/* First set of logos */}
        <LogisticsIcons />
        {/* Duplicate set for seamless looping */}
        <LogisticsIcons />
      </motion.div>
    </div>
  );
}

function LogisticsIcons() {
  const icons = [
    { name: "Air Freight", icon: "✈️" },
    { name: "Ocean", icon: "🚢" },
    { name: "Trucking", icon: "🚛" },
    { name: "Rail", icon: "🚂" },
    { name: "Warehousing", icon: "🏭" },
    { name: "Customs", icon: "🛃" },
    { name: "Last Mile", icon: "📦" },
  ];

  return (
    <>
      {icons.map((item) => (
        <div
          key={item.name}
          className="bg-muted/30 border-border/50 hover:bg-muted/50 flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-xl border transition-colors"
        >
          <span className="text-2xl opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
            {item.icon}
          </span>
          <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            {item.name}
          </span>
        </div>
      ))}
    </>
  );
}

// Chat messaging component with iPhone mockup
export function ChatMessaging() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[500px] w-[280px] overflow-hidden rounded-[36px] border-4 border-neutral-700 bg-neutral-800 p-3 shadow-2xl">
        <div className="absolute top-0 left-1/2 z-10 h-6 w-1/3 -translate-x-1/2 transform rounded-b-xl bg-neutral-700" />
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-neutral-900 p-4">
          <div className="mb-6 flex items-center pt-2">
            <Avatar className="mr-3 h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-medium text-white">Assistant</div>
              <div className="text-[10px] text-neutral-400">Online</div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-[85%] rounded-2xl rounded-tl-none bg-neutral-800 p-3 text-[11px] text-neutral-200"
            >
              How can I help you today?
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3 text-[11px]"
            >
              Do you have cargo service from Imphal to New Delhi?
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-[85%] rounded-2xl rounded-tl-none bg-neutral-800 p-3 text-[11px] text-neutral-200"
            >
              We use partner flight services. If a compatible schedule exists,
              we can definitely help. What are you shipping?
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3 text-[11px]"
            >
              About 500kg of organic produce.
            </motion.div>
          </div>

          {/* Mock Input Area */}
          <div className="mt-2 h-10 w-full rounded-full bg-neutral-800 opacity-50" />
        </div>
      </div>
    </div>
  );
}
