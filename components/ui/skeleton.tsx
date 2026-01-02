import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted/50 rounded-md animate-pulse shimmer", className)}
      {...props}
    />
  )
}

export { Skeleton }
