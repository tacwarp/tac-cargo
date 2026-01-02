"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiArrowRightSLine } from "@remixicon/react"

import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
} from "@/components/ui/sidebar"

export function NavMain({
  label,
  items,
}: {
  label: string
  items: {
    title: string
    url: string
    icon: React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">{label}</SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = item.isActive ?? pathname === item.url
          const isSubItemActive = item.items?.some(subItem => pathname === subItem.url)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive || isSubItemActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-300 h-9 px-3",
                    isActive ? "bg-primary/10 text-primary border-l-2 border-primary shadow-[inset_4px_0_12px_-4px_hsl(var(--primary)/0.2)]" : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground/60")} />
                    <span className={cn("text-xs font-medium tracking-tight", isActive ? "text-foreground" : "text-muted-foreground")}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-200">
                        <RiArrowRightSLine className="size-4" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l border-border/10 py-1 space-y-0.5">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className={cn(
                                "h-8 text-[11px] transition-colors",
                                pathname === subItem.url ? "text-primary font-bold" : "text-muted-foreground/60 hover:text-foreground"
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
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
