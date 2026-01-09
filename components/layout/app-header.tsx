"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { BellIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";

export function AppHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="bg-background/60 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 px-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground size-10 rounded-lg transition-all hover:bg-white/10 hover:text-white [&_svg]:!size-5" />
        <Separator orientation="vertical" className="!h-6 bg-white/10" />

        {/* Breadcrumb - Tech Style */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList className="gap-1">
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const title =
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ");

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-primary/90 bg-primary/10 border-primary/20 rounded border px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="text-muted-foreground text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-white"
                      >
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-muted-foreground/30 mx-1 rotate-[-20deg]" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Central Command Input */}
      <div className="mx-auto flex max-w-2xl flex-1 justify-center">
        <div className="group relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <SearchIcon className="text-muted-foreground group-focus-within:text-primary size-4 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="COMMAND SEARCH // ENTER AWB, ROUTE ID, OR DRIVER..."
            className="placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/50 h-10 w-full rounded-lg border border-white/10 bg-black/20 pr-4 pl-10 font-mono text-xs tracking-wider text-white uppercase transition-all focus:ring-1 focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 opacity-50">
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">
              CTRL
            </span>
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">
              K
            </span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Status Indicators */}
        <div className="mr-4 hidden items-center gap-4 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 md:flex">
          <div className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-success shadow-[0_0_8px_color-mix(in_oklch,var(--success)_50%,transparent)]" />
            <span className="text-[10px] font-medium tracking-wider text-success uppercase">
              System Online
            </span>
          </div>
          <Separator orientation="vertical" className="h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-warning" />
            <span className="text-[10px] font-medium tracking-wider text-warning uppercase">
              3 Alerts
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground relative size-9 rounded-lg transition-all hover:bg-white/10 hover:text-white"
        >
          <BellIcon className="size-5" />
          <span className="bg-destructive border-background absolute top-2 right-2 size-2 animate-pulse rounded-full border-2 shadow-[0_0_10px_color-mix(in_oklch,var(--destructive)_50%,transparent)]" />
        </Button>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 !h-6 bg-white/10" />

        <ProfileDropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="hover:ring-primary/50 size-9 rounded-full p-0 ring-offset-2 ring-offset-transparent transition-all hover:ring-2"
            >
              <Avatar className="size-8 ring-1 ring-white/20">
                <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                <AvatarFallback className="bg-primary text-[10px] font-bold text-white">
                  TC
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    </header>
  );
}
