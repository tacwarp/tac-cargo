"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  label,
  items,
}: {
  label: string;
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground/50 mb-2 text-[10px] font-bold tracking-[0.15em] uppercase">
          {label}
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground/50 mb-2 text-[10px] font-bold tracking-[0.15em] uppercase">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = item.isActive ?? pathname === item.url;
          const isSubItemActive = item.items?.some(
            (subItem) => pathname === subItem.url,
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive || isSubItemActive}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "group/nav-item h-9 rounded-lg px-3 transition-all duration-200",
                    isActive
                      ? "from-primary/15 via-primary/10 text-primary border-primary border-l-[3px] bg-gradient-to-r to-transparent shadow-[inset_6px_0_20px_-6px_var(--glow-primary)]"
                      : "hover:bg-muted/50 text-muted-foreground border-l-[3px] border-transparent hover:translate-x-1",
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "size-4 transition-all duration-200",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground/50 group-hover/nav-item:text-primary/70 group-hover/nav-item:scale-110",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium tracking-tight transition-colors",
                        isActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground/80 group-hover/nav-item:text-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-border/10 ml-4 space-y-0.5 border-l py-1">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className={cn(
                                "h-8 text-[11px] transition-colors",
                                pathname === subItem.url
                                  ? "text-primary font-bold"
                                  : "text-muted-foreground/60 hover:text-foreground",
                              )}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
