"use client";

import { cn } from "@/lib/utils";
import { Package, Truck, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react";

interface StatusStage {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

interface StatusPipelineProps {
  stages: StatusStage[];
  onStageClick?: (stageId: string) => void;
  activeStage?: string;
}

const defaultStages: StatusStage[] = [
  { id: "pending", label: "Pending", count: 0, icon: Clock, color: "text-slate-500 bg-slate-500/10" },
  { id: "picked_up", label: "Picked Up", count: 0, icon: Package, color: "text-blue-500 bg-blue-500/10" },
  { id: "in_transit", label: "In Transit", count: 0, icon: Truck, color: "text-amber-500 bg-amber-500/10" },
  { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-purple-500 bg-purple-500/10" },
  { id: "delivered", label: "Delivered", count: 0, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
  { id: "failed", label: "Failed", count: 0, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
];

export function StatusPipeline({
  stages = defaultStages,
  onStageClick,
  activeStage,
}: StatusPipelineProps) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isActive = activeStage === stage.id;
        const [textColor, bgColor] = stage.color.split(" ");

        return (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => onStageClick?.(stage.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[100px] px-4 py-3 rounded-lg border transition-all",
                "hover:shadow-md hover:scale-[1.02]",
                isActive ? "ring-2 ring-primary ring-offset-2" : "",
                bgColor
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", textColor)} />
              <span className={cn("text-lg font-bold", textColor)}>{stage.count}</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {stage.label}
              </span>
            </button>
            
            {index < stages.length - 1 && (
              <div className="flex items-center px-1">
                <div className="w-4 h-0.5 bg-border" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { defaultStages };
export type { StatusStage };
