"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap, Truck, Package, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
    id: number;
    title: string;
    date: string;
    content: string;
    category: string;
    icon: React.ElementType;
    relatedIds: number[];
    status: "completed" | "in-progress" | "pending";
    energy: number;
}

interface RadialOrbitalTimelineProps {
    timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
    timelineData,
}: RadialOrbitalTimelineProps) {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {}
    );
    const [viewMode, setViewMode] = useState<"orbital">("orbital");
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [autoRotate, setAutoRotate] = useState<boolean>(true);
    const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
    const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setActiveNodeId(null);
            setPulseEffect({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setAutoRotate(false);

                const relatedItems = getRelatedItems(id);
                const newPulseEffect: Record<number, boolean> = {};
                relatedItems.forEach((relId) => {
                    newPulseEffect[relId] = true;
                });
                setPulseEffect(newPulseEffect);

                centerViewOnNode(id);
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    useEffect(() => {
        let rotationTimer: NodeJS.Timeout;

        if (autoRotate && viewMode === "orbital") {
            rotationTimer = setInterval(() => {
                setRotationAngle((prev) => {
                    const newAngle = (prev + 0.3) % 360;
                    return Number(newAngle.toFixed(3));
                });
            }, 50);
        }

        return () => {
            if (rotationTimer) {
                clearInterval(rotationTimer);
            }
        };
    }, [autoRotate, viewMode]);

    const centerViewOnNode = (nodeId: number) => {
        if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        const totalNodes = timelineData.length;
        const targetAngle = (nodeIndex / totalNodes) * 360;

        setRotationAngle(270 - targetAngle);
    };

    const calculateNodePosition = (index: number, total: number) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 220; // Increased radius for better spacing
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + centerOffset.x;
        const y = radius * Math.sin(radian) + centerOffset.y;

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(
            0.4,
            Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
        );

        return { x, y, angle, zIndex, opacity };
    };

    const getRelatedItems = (itemId: number): number[] => {
        const currentItem = timelineData.find((item) => item.id === itemId);
        return currentItem ? currentItem.relatedIds : [];
    };

    const isRelatedToActive = (itemId: number): boolean => {
        if (!activeNodeId) return false;
        const relatedItems = getRelatedItems(activeNodeId);
        return relatedItems.includes(itemId);
    };

    const getStatusStyles = (status: TimelineItem["status"]): string => {
        switch (status) {
            case "completed":
                return "text-primary-foreground bg-primary border-primary ring-1 ring-primary/50";
            case "in-progress":
                return "text-foreground bg-background border-border ring-1 ring-border";
            case "pending":
                return "text-muted-foreground bg-muted/40 border-border/50";
            default:
                return "text-muted-foreground bg-muted/40 border-border/50";
        }
    };

    return (
        <div
            className="w-full h-[800px] flex flex-col items-center justify-center bg-transparent overflow-hidden relative"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-1000">
                <div
                    className="absolute w-full h-full flex items-center justify-center preserve-3d"
                    ref={orbitRef}
                    style={{
                        transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
                    }}
                >
                    {/* Central Hub */}
                    <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-secondary animate-pulse-orbital flex items-center justify-center z-10 shadow-orbital cursor-pointer hover:scale-110 transition-transform">
                        <div className="absolute w-20 h-20 rounded-full border border-primary/20 animate-ping-orbital opacity-70"></div>
                        <div
                            className="absolute w-24 h-24 rounded-full border border-primary/10 animate-ping-orbital opacity-50"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                        </div>
                    </div>

                    {/* Orbital Rings - Use foreground with low opacity for visibility in both themes */}
                    <div className="absolute w-[440px] h-[440px] rounded-full border border-foreground/10 opacity-50"></div>
                    <div className="absolute w-[600px] h-[600px] rounded-full border border-foreground/10 opacity-30 border-dashed animate-[spin_60s_linear_infinite]"></div>

                    {timelineData.map((item, index) => {
                        const position = calculateNodePosition(index, timelineData.length);
                        const isExpanded = expandedItems[item.id];
                        const isRelated = isRelatedToActive(item.id);
                        const isPulsing = pulseEffect[item.id];
                        const Icon = item.icon;

                        const nodeStyle = {
                            transform: `translate(${position.x.toFixed(3)}px, ${position.y.toFixed(3)}px)`,
                            zIndex: isExpanded ? 200 : position.zIndex,
                            opacity: isExpanded ? 1 : Number(position.opacity.toFixed(6)),
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { nodeRefs.current[item.id] = el; }} // Fixed Ref
                                className="absolute transition-all duration-700 cursor-pointer"
                                style={nodeStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
                                {/* Energy Field */}
                                <div
                                    className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""
                                        }`}
                                    style={{
                                        background: `radial-gradient(circle, rgba(var(--primary),0.1) 0%, rgba(255,255,255,0) 70%)`,
                                        width: `${item.energy * 0.5 + 40}px`,
                                        height: `${item.energy * 0.5 + 40}px`,
                                        left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                        top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                    }}
                                ></div>

                                {/* Node Icon */}
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform",
                                        isExpanded
                                            ? "bg-card text-card-foreground border-primary shadow-lg shadow-primary/20 scale-125"
                                            : isRelated
                                                ? "bg-card/80 text-foreground border-primary animate-pulse"
                                                : "bg-card/80 text-muted-foreground border-foreground/10 hover:border-foreground/30"
                                    )}
                                >
                                    <Icon size={isExpanded ? 20 : 18} />
                                </div>

                                {/* Label (Visible when not expanded) */}
                                <div
                                    className={cn(
                                        "absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 uppercase",
                                        isExpanded ? "opacity-0" : "text-muted-foreground/70"
                                    )}
                                >
                                    {item.title}
                                </div>

                                {/* Expanded Card */}
                                {isExpanded && (
                                    <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-80 bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-primary/10 overflow-visible z-50">

                                        {/* Connector Line */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-primary/0 to-primary/50"></div>

                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("px-2 text-[10px] h-5", getStatusStyles(item.status))}
                                                >
                                                    {item.status === "completed"
                                                        ? "OPERATIONAL"
                                                        : item.status === "in-progress"
                                                            ? "PROCESSING"
                                                            : "SCHEDULED"}
                                                </Badge>
                                                <span className="text-[10px] font-mono text-muted-foreground">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg mt-2 font-bold text-card-foreground">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            <p className="leading-relaxed">{item.content}</p>

                                            <div className="mt-4 pt-3 border-t border-border">
                                                <div className="flex justify-between items-center text-[10px] mb-1 uppercase tracking-widest text-muted-foreground/60">
                                                    <span className="flex items-center gap-1">
                                                        <Zap size={10} className="text-primary" />
                                                        Efficiency
                                                    </span>
                                                    <span className="font-mono text-card-foreground">{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-accent"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-border">
                                                    <div className="flex items-center mb-2">
                                                        <Link size={10} className="text-muted-foreground/60 mr-1" />
                                                        <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
                                                            Linked Processes
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <Button
                                                                    key={relatedId}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-[10px] border border-border hover:bg-muted hover:text-foreground"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleItem(relatedId);
                                                                    }}
                                                                >
                                                                    {relatedItem?.title}
                                                                    <ArrowRight
                                                                        size={8}
                                                                        className="ml-1 text-muted-foreground"
                                                                    />
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
