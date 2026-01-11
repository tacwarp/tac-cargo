"use client";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Link,
  Zap,
  ShieldCheck,
} from "lucide-react";
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
    {},
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
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
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)),
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
      className="relative flex h-[800px] w-full flex-col items-center justify-center overflow-hidden bg-transparent"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-transparent">
        <div className="bg-primary/5 h-[600px] w-[600px] rounded-full blur-[100px]" />
      </div>

      <div className="perspective-1000 relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="preserve-3d absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Hub */}
          <div className="from-primary via-accent to-secondary animate-pulse-orbital shadow-orbital absolute z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br transition-transform hover:scale-110">
            <div className="border-primary/20 animate-ping-orbital absolute h-20 w-20 rounded-full border opacity-70"></div>
            <div
              className="border-primary/10 animate-ping-orbital absolute h-24 w-24 rounded-full border opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="bg-background/80 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md">
              <ShieldCheck className="text-primary h-4 w-4" />
            </div>
          </div>

          {/* Orbital Rings - Use foreground with low opacity for visibility in both themes */}
          <div className="border-foreground/10 absolute h-[440px] w-[440px] rounded-full border opacity-50"></div>
          <div className="border-foreground/10 absolute h-[600px] w-[600px] animate-[spin_60s_linear_infinite] rounded-full border border-dashed opacity-30"></div>

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
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }} // Fixed Ref
                className="absolute cursor-pointer transition-all duration-700"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Energy Field */}
                <div
                  className={`absolute -inset-1 rounded-full ${isPulsing ? "animate-pulse duration-1000" : ""
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
                    "flex h-12 w-12 transform items-center justify-center rounded-full border-2 transition-all duration-300",
                    isExpanded
                      ? "bg-card text-card-foreground border-primary shadow-primary/20 scale-125 shadow-lg"
                      : isRelated
                        ? "bg-card/80 text-foreground border-primary animate-pulse"
                        : "bg-card/80 text-muted-foreground border-foreground/10 hover:border-foreground/30",
                  )}
                >
                  <Icon size={isExpanded ? 20 : 18} />
                </div>

                {/* Label (Visible when not expanded) */}
                <div
                  className={cn(
                    "absolute top-14 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all duration-300",
                    isExpanded ? "opacity-0" : "text-muted-foreground/70",
                  )}
                >
                  {item.title}
                </div>

                {/* Expanded Card */}
                {isExpanded && (
                  <Card className="bg-card/95 border-border shadow-primary/10 absolute top-24 left-1/2 z-50 w-80 -translate-x-1/2 overflow-visible shadow-2xl backdrop-blur-xl">
                    {/* Connector Line */}
                    <div className="from-primary/0 to-primary/50 absolute -top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-gradient-to-b"></div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5 px-2 text-[10px]",
                            getStatusStyles(item.status),
                          )}
                        >
                          {item.status === "completed"
                            ? "OPERATIONAL"
                            : item.status === "in-progress"
                              ? "PROCESSING"
                              : "SCHEDULED"}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-card-foreground mt-2 text-lg font-bold">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="border-border mt-4 border-t pt-3">
                        <div className="text-muted-foreground/60 mb-1 flex items-center justify-between text-[10px] tracking-widest uppercase">
                          <span className="flex items-center gap-1">
                            <Zap size={10} className="text-primary" />
                            Efficiency
                          </span>
                          <span className="text-card-foreground font-mono">
                            {item.energy}%
                          </span>
                        </div>
                        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
                          <div
                            className="from-primary to-accent h-full bg-gradient-to-r"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="border-border mt-4 border-t pt-3">
                          <div className="mb-2 flex items-center">
                            <Link
                              size={10}
                              className="text-muted-foreground/60 mr-1"
                            />
                            <h4 className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                              Linked Processes
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId,
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="ghost"
                                  size="sm"
                                  className="border-border hover:bg-muted hover:text-foreground h-6 border px-2 text-[10px]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="text-muted-foreground ml-1"
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
