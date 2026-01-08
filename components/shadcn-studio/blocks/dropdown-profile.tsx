"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon,
} from "lucide-react";
import { signOutUser } from "@/lib/auth-helpers";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
  user,
}: Props) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    // Use robust sign-out with forced local cleanup
    // This prevents authentication state inconsistency even if server sign-out fails
    await signOutUser();

    // Always redirect to login regardless of result
    // Local cleanup is guaranteed to have been performed
    router.push("/login");
  };

  const displayName = user?.name || "John Doe";
  const displayEmail = user?.email || "john.doe@example.com";
  const displayAvatar =
    user?.avatar ||
    "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!mounted) {
    return <>{trigger}</>;
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-success ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              {displayName}
            </span>
            <span className="text-muted-foreground text-base">
              {displayEmail}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UserIcon className="text-foreground size-5" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SettingsIcon className="text-foreground size-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CreditCardIcon className="text-foreground size-5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UsersIcon className="text-foreground size-5" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SquarePenIcon className="text-foreground size-5" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CirclePlusIcon className="text-foreground size-5" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
