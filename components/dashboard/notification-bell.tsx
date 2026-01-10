"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bell, Package, AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "shipment" | "alert" | "success" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  href?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClear?: (id: string) => void;
}

const notificationIcons = {
  shipment: Package,
  alert: AlertCircle,
  success: CheckCircle,
  info: Clock,
};

const notificationColors = {
  shipment: "bg-blue-500/10 text-blue-500",
  alert: "bg-red-500/10 text-red-500",
  success: "bg-emerald-500/10 text-emerald-500",
  info: "bg-amber-500/10 text-amber-500",
};

export function NotificationBell({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
}: NotificationBellProps) {
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-lg transition-colors",
            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            unreadCount > 0 && "text-primary"
          )}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => {
                      onMarkAsRead?.(notification.id);
                      if (notification.href) {
                        window.location.href = notification.href;
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        notificationColors[notification.type]
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm",
                            !notification.read && "font-medium"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    {onClear && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(notification.id);
                        }}
                        className="absolute top-2 right-2 p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <button
              onClick={() => setOpen(false)}
              className="w-full text-center text-xs text-primary hover:underline"
            >
              View all notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
