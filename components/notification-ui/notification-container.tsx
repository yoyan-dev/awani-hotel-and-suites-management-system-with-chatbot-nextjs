"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types/notification";
import { NotificationPanel } from "./notification-panel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
} from "@heroui/react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useNotification } from "@/hooks/use-notification";

export function NotificationContainer() {
  const {
    notifications,
    isLoading,
    fetchNotifications,
    updateNotification,
    deleteSelectedNotifications,
  } = useNotification();

  // mark all as read
  function markAllRead() {
    notifications.map((notification) =>
      updateNotification({
        id: notification.id,
        is_read: true,
      } as Notification),
    );
  }

  function clearNotifications() {
    // deleteSelectedNotifications();
    fetchNotifications();
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    setInterval(() => {
      fetchNotifications();
    }, 5000);
  }, []);

  return (
    <Popover
      placement="bottom-end"
      onOpenChange={(open) => {
        if (open) markAllRead();
      }}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          color="default"
          variant="light"
          radius="full"
          size="lg"
        >
          <Badge
            content={unreadCount}
            color="danger"
            isInvisible={unreadCount === 0}
          >
            <Bell size={22} />
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[380px]">
        <NotificationPanel
          isLoading={isLoading}
          notifications={notifications}
          onClear={clearNotifications}
        />
      </PopoverContent>
    </Popover>
  );
}
