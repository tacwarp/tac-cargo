import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-6">
      <Card className="border-border/50 bg-card/30">
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
