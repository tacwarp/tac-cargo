"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { signOutUser } from "@/lib/auth-helpers"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    // Use robust sign-out with forced local cleanup
    // This prevents authentication state inconsistency even if server sign-out fails
    const result = await signOutUser()

    // Always redirect to login regardless of result
    // Local cleanup is guaranteed to have been performed
    router.push('/login')

    // Note: If result.success is false, the server session may still exist
    // but local state is cleared, preventing access to protected routes
  }

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-primary/5 h-12 border-t border-border/10 rounded-none hover:bg-muted/30 transition-all duration-300"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-md border border-white/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md bg-secondary text-[10px]">AD</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-background bg-success" />
              </div>
              <div className="grid flex-1 text-left ml-1">
                <span className="truncate text-xs font-bold text-foreground uppercase tracking-tight">{user.name}</span>
                <span className="truncate text-[10px] font-medium text-muted-foreground/60 uppercase tracking-tighter">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-3 opacity-40" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md glass-card noise-overlay border-border/20 shadow-glow-primary/10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                <Avatar className="h-8 w-8 rounded-md border border-white/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md bg-secondary text-[10px]">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left">
                  <span className="truncate text-xs font-bold text-foreground uppercase tracking-tight">{user.name}</span>
                  <span className="truncate text-[10px] font-medium text-muted-foreground/60 uppercase tracking-tighter">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/10" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                <Sparkles className="size-3.5 mr-2 text-primary" />
                Management Console
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/10" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 focus:bg-primary/10 transition-colors cursor-pointer">
                <BadgeCheck className="size-3.5 mr-2 opacity-60" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 focus:bg-primary/10 transition-colors cursor-pointer">
                <CreditCard className="size-3.5 mr-2 opacity-60" />
                Access Keys
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 focus:bg-primary/10 transition-colors cursor-pointer">
                <Bell className="size-3.5 mr-2 opacity-60" />
                Alert Logs
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/10" />
            <div className="p-1">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5 mr-2" />
                Terminate Session
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
