"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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
            title: "World-Class Information Design",
            description:
                "Transform complex data into crisp visuals that quickly tell your story.",
            image:
                "https://res.cloudinary.com/harshitproject/image/upload/v1746774246/hero-video.jpg",
        },
        {
            id: "2",
            type: "chat",
            content: <ChatMessaging />,
        },
        {
            id: "3",
            type: "partners",
            title: "Connected Everywhere",
            description:
                "Embed your work seamlessly across your favorite platforms for instant sharing.",
            content: <CompanyLogos />,
        },
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container mx-auto px-4 relative z-10 space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-primary" />
                        <span className="font-mono text-sm uppercase tracking-widest text-primary">Operational Logic</span>
                        <div className="h-px w-8 bg-primary" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Precision from <span className="text-primary">Origin</span> to <span className="text-primary">Destination</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Our autonomous logistics protocol ensures transparency and security at every node of the supply chain.
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
                "grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {items.map((item) => {
                return (
                    <div
                        key={item.id}
                        className={cn(
                            "row-span-1",
                            item.type === "feature" && "col-span-1 md:col-span-2",
                            item.className
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
                        "group relative overflow-hidden rounded-xl bg-primary/5 dark:bg-neutral-900 border border-border p-8 h-[400px] flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow",
                        className
                    )}
                >
                    <div className="flex flex-col justify-center z-10 md:w-1/2">
                        <span className="text-xs uppercase text-primary font-medium mb-2">
                            Visualise Info
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                            {title}
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md text-balance">
                            {description}
                        </p>
                    </div>

                    {image && (
                        <div className=" md:w-1/2 h-full right-0 top-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 z-0"
                                >
                                    <div className="relative w-full h-full top-10 left-10">
                                        <Image
                                            src={image || "/placeholder.svg"}
                                            alt="visualise"
                                            fill
                                            className="object-cover rounded-md shadow-xl dark:shadow-primary/20 shadow-black/10"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-0 z-50 inset-x-0 h-[2rem] bg-gradient-to-t from-background to-transparent w-full pointer-events-none" />
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
                        "group relative overflow-hidden rounded-xl bg-card border border-border p-8 h-[400px] flex flex-col shadow-sm hover:shadow-md transition-shadow",
                        className
                    )}
                >
                    <div className="z-10">
                        <span className="text-xs uppercase text-primary font-medium mb-2 flex items-center justify-center p-2">
                            Customise
                        </span>
                    </div>

                    <div className="flex-1 relative">{content}</div>
                    <div className="absolute bottom-0 z-50 inset-x-0 h-[2rem] bg-gradient-to-t from-background/50 to-transparent w-full pointer-events-none" />
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
                        "group relative overflow-hidden rounded-xl bg-card border border-border p-8 h-[400px] flex flex-col shadow-sm hover:shadow-md transition-shadow",
                        className
                    )}
                >
                    <div className="flex-1 relative flex items-center justify-center">
                        {content}
                        <div className="absolute left-0 z-[100] inset-y-0 w-10 bg-gradient-to-r from-card to-transparent h-full pointer-events-none" />
                        <div className="absolute right-0 z-[100] inset-y-0 w-10 bg-gradient-to-l from-card to-transparent h-full pointer-events-none" />
                    </div>

                    <div className="mt-4 z-10">
                        <span className="text-xs uppercase text-primary font-medium ">
                            Embed
                        </span>
                        <h3 className="text-2xl font-bold text-foreground mb-2 text-balance">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground text-balance">
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
    const logos = [
        {
            name: "Spotify",
            url: "https://res.cloudinary.com/harshitproject/image/upload/v1746774292/Spotify.png",
        },
        {
            name: "Notion",
            url: "https://res.cloudinary.com/harshitproject/image/upload/v1746774291/Notion.png",
        },
        {
            name: "Slack",
            url: "https://res.cloudinary.com/harshitproject/image/upload/v1746774292/Slack.png",
        },
        {
            name: "Twitter",
            url: "https://res.cloudinary.com/harshitproject/image/upload/v1746774292/Twitter.png",
        },
        {
            name: "Apple",
            url: "https://res.cloudinary.com/harshitproject/image/upload/v1746774291/Apple.png",
        },
    ];

    return (
        <div className="w-full overflow-hidden">
            <motion.div
                className="flex gap-8 items-center justify-center"
                animate={{ x: [0, -1000] }}
                transition={{
                    x: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    },
                }}
            >
                {/* First set of logos */}
                {logos.map((logo) => (
                    <div
                        key={logo.name}
                        className="flex-shrink-0 w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center p-2 border border-border/50"
                    >
                        <Image
                            src={logo.url || "/placeholder.svg"}
                            alt={logo.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    </div>
                ))}

                {/* Duplicate set for seamless looping */}
                {logos.map((logo) => (
                    <div
                        key={`${logo.name}-dup`}
                        className="flex-shrink-0 w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center p-2 border border-border/50"
                    >
                        <Image
                            src={logo.url || "/placeholder.svg"}
                            alt={logo.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// Chat messaging component with iPhone mockup
export function ChatMessaging() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[280px] h-[500px] bg-neutral-800 rounded-[36px] p-3 border-4 border-neutral-700 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-neutral-700 rounded-b-xl z-10" />
                <div className="w-full h-full bg-neutral-900 rounded-[28px] p-4 overflow-hidden flex flex-col">
                    <div className="flex items-center mb-6 pt-2">
                        <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-white text-xs font-medium">Assistant</div>
                            <div className="text-neutral-400 text-[10px]">Online</div>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-[11px] text-neutral-200"
                        >
                            How can I help you today?
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-primary p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-[11px] text-primary-foreground"
                        >
                            I need help with my project
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-[11px] text-neutral-200"
                        >
                            I&apos;d be happy to help! What kind of project are you working
                            on?
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="bg-primary p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-[11px] text-primary-foreground"
                        >
                            I&apos;m building a component library with Next.js and Tailwind
                        </motion.div>
                    </div>

                    {/* Mock Input Area */}
                    <div className="mt-2 h-10 bg-neutral-800 rounded-full w-full opacity-50" />
                </div>
            </div>
        </div>
    );
}
