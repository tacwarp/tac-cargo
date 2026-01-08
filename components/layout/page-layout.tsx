import { cn } from "@/lib/utils";

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Optional badge/label next to title */
  badge?: React.ReactNode;
  /** Parent section for breadcrumbs (e.g. "Fleet") */
  parent?: string;
  /** Compact mode reduces vertical spacing */
  compact?: boolean;
}

export function PageLayout({
  title,
  description,
  actions,
  children,
  badge,
  parent,
  compact = false,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-8", compact && "space-y-5")}>
      {/* Premium Header Block */}
      <header className="relative">
        {/* Subtle gradient accent line */}
        <div className="from-primary via-accent to-primary/50 absolute top-1/2 -left-6 h-12 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b opacity-80" />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {parent && (
                <>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer text-2xl font-medium tracking-tight uppercase transition-colors">
                    {parent}
                  </span>
                  <span className="text-muted-foreground/30 text-2xl font-light">
                    /
                  </span>
                </>
              )}
              <h1 className="text-foreground text-2xl font-black tracking-tight uppercase">
                {title}
              </h1>
              {badge && (
                <span className="bg-primary/10 text-primary border-primary/20 mb-1 rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground/70 max-w-lg text-[11px] font-medium tracking-wide uppercase">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-3">{actions}</div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative">{children}</div>
    </div>
  );
}
