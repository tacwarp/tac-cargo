"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardData {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  trendLabel: string;
  footerLabel: string;
}

interface SectionCardsProps {
  cards?: SectionCardData[];
}

const defaultCards: SectionCardData[] = [
  {
    title: "Total Shipments",
    value: "1,234",
    description: "Active shipments in pipeline",
    trend: 12.5,
    trendLabel: "+12.5%",
    footerLabel: "Trending up this month",
  },
  {
    title: "Delivered Today",
    value: "89",
    description: "Successful deliveries",
    trend: 8.2,
    trendLabel: "+8.2%",
    footerLabel: "Above daily average",
  },
  {
    title: "Revenue",
    value: "₹4.5L",
    description: "This month's collection",
    trend: -3.5,
    trendLabel: "-3.5%",
    footerLabel: "Needs attention",
  },
  {
    title: "Delivery Rate",
    value: "94.5%",
    description: "On-time delivery",
    trend: 2.1,
    trendLabel: "+2.1%",
    footerLabel: "Exceeds target of 90%",
  },
];

export function SectionCards({ cards = defaultCards }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const isPositive = card.trend >= 0;
        const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={index} className="@container/card group">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge 
                  variant="outline" 
                  className={isPositive ? "text-emerald-600 border-emerald-200" : "text-red-600 border-red-200"}
                >
                  <TrendIcon className="size-3" />
                  {card.trendLabel}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerLabel}
                <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground text-xs">
                {card.description}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export type { SectionCardData };
