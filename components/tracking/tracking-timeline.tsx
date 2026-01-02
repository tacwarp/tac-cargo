"use client"

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../ui/accordion"
import { TrackingEvent } from "@/types/tracking"
import { CheckCircle2, Clock, Truck, Plane } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
    // Sort events by timestamp descending for the list
    const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const iconKeywordMap: Record<string, typeof CheckCircle2> = {
        deliver: CheckCircle2,
        flight: Plane,
        air: Plane,
        truck: Truck,
        drive: Truck,
        road: Truck,
        process: Clock,
        book: Clock,
    }

    const getIcon = (label: string) => {
        const lowerLabel = label.toLowerCase()
        for (const [keyword, icon] of Object.entries(iconKeywordMap)) {
            if (lowerLabel.includes(keyword)) return icon
        }
        return Clock
    }

    return (
        <Accordion type="single" collapsible className="w-full border rounded-xl overflow-hidden bg-card/50">
            <AccordionItem value="history" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Full Tracking History</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                    <div className="relative space-y-0 pl-10 sm:pl-12 pt-4">
                        {/* Timeline vertical line */}
                        <div className="absolute left-[19px] sm:left-[23px] top-0 bottom-4 w-0.5 bg-muted" />

                        {sortedEvents.map((e, index) => {
                            const isLatest = index === 0
                            const Icon = getIcon(e.label)
                            return (
                                <div key={e.id} className="relative pb-8 last:pb-2">
                                    {/* Timeline Node Icon */}
                                    <div className={cn(
                                        "absolute -left-[32px] sm:-left-[36px] top-0 h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-background z-10",
                                        isLatest ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                    )}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                        <div>
                                            <p className={cn("font-semibold text-sm leading-tight", isLatest ? "text-foreground" : "text-muted-foreground")}>
                                                {e.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                                {e.location}
                                            </p>
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded-md border border-border/50 w-fit">
                                            {new Date(e.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
