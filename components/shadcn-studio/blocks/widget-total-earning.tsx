import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
  title: string;
  earning: number;
  trend: "up" | "down";
  percentage: number;
  comparisonText: string;
  earningData: {
    img?: string;
    icon?: ReactNode;
    platform: string;
    technologies: string;
    earnings: string;
    progressPercentage: number;
  }[];
  className?: string;
};

const TotalEarningCard = ({
  earningData,
  title,
  earning,
  trend,
  percentage,
  comparisonText,
  className,
}: Props) => {
  return (
    <Card
      className={cn(
        "glass-card noise-overlay relative overflow-hidden border-none shadow-none",
        className,
      )}
    >
      <CardHeader className="border-border/10 flex flex-row items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground text-xs font-bold tracking-widest uppercase">
            {title}
          </span>
          <span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase opacity-60">
            Revenue Overview
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-primary/10 size-8 rounded-md"
            >
              <EllipsisVerticalIcon className="size-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass-intense noise-overlay border-white/10"
          >
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="focus:bg-primary/10 text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-8 pt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-kpi text-foreground text-4xl font-black tracking-tighter">
              ₹{earning.toLocaleString()}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 rounded border border-white/10 px-2 py-0.5 text-[10px] font-black",
                trend === "up"
                  ? "text-success bg-success/10"
                  : "text-destructive bg-destructive/10",
              )}
            >
              {trend === "up" ? (
                <ChevronUpIcon className="size-3" />
              ) : (
                <ChevronDownIcon className="size-3" />
              )}
              <span>{percentage}%</span>
            </span>
          </div>
          <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
            {comparisonText}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-evenly gap-3">
          {earningData.map((earning, index) => (
            <div
              key={index}
              className="hover:border-border/10 hover:bg-primary/[0.02] group flex items-center justify-between gap-4 rounded border border-transparent p-3 transition-all"
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-10 rounded-md border border-white/10">
                  <AvatarFallback className="bg-secondary dark:bg-card text-primary shrink-0 rounded-md shadow-sm transition-transform group-hover:scale-105">
                    {earning.icon ? (
                      earning.icon
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={earning.img}
                        alt={earning.platform}
                        className="size-5 brightness-200 grayscale invert"
                      />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="text-foreground text-xs font-bold tracking-tight uppercase">
                    {earning.platform}
                  </span>
                  <span className="text-muted-foreground/50 text-[9px] font-bold tracking-[0.15em] uppercase">
                    {earning.technologies}
                  </span>
                </div>
              </div>
              <div className="max-w-[120px] flex-1 space-y-2 text-right">
                <p className="text-kpi text-foreground text-xs font-bold">
                  {earning.earnings}
                </p>
                <div className="bg-secondary/30 h-1 w-full overflow-hidden rounded-full">
                  <Progress
                    value={earning.progressPercentage}
                    className="bg-primary shadow-glow-primary/20 h-full transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalEarningCard;
