"use client";

import React, { useEffect, useRef } from "react";
import type { Notification } from "@/types/notification";
import { NotificationPanel } from "./notification-panel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
} from "@heroui/react";
import { Bell } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";

export function NotificationContainer() {
  const {
    notifications,
    isLoading,
    isLoadingMore,
    page,
    limit,
    hasMore,
    fetchNotificationsPage,
    updateNotification,
    markNotificationsReadLocal,
  } = useNotification();

  function markAllRead() {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);
    if (!unreadIds.length) return;

    // Optimistic UI update
    markNotificationsReadLocal(unreadIds);

    unreadIds.forEach((id) => {
      updateNotification({ id, is_read: true } as Notification);
    });
  }

  function clearNotifications() {
    // deleteSelectedNotifications();
    fetchNotificationsPage({ page: 1, limit, append: false });
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    fetchRef.current = () =>
      fetchNotificationsPage({ page: 1, limit, append: false });
  }, [fetchNotificationsPage, limit]);

  const metaRef = useRef<{ unreadCount: number; latestCreatedAt: string }>({
    unreadCount: -1,
    latestCreatedAt: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function checkForUpdates() {
      try {
        const res = await fetch("/api/notifications/meta");
        const data = await res.json();
        if (!isMounted || !data?.success || !data?.data) return;
        const { unreadCount, latestCreatedAt } = data.data;
        if (
          unreadCount !== metaRef.current.unreadCount ||
          latestCreatedAt !== metaRef.current.latestCreatedAt
        ) {
          metaRef.current.unreadCount = unreadCount;
          metaRef.current.latestCreatedAt = latestCreatedAt;
          fetchRef.current();
        }
      } catch (error) {
        console.error("Failed to check notifications meta:", error);
      }
    }

    fetchRef.current();
    const interval = setInterval(checkForUpdates, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Popover
      placement="bottom-end"
      onOpenChange={(open) => {
        if (!open) {
          markAllRead();
        }
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
          onLoadMore={() => {
            if (!isLoadingMore && hasMore) {
              fetchNotificationsPage({
                page: page + 1,
                limit,
                append: true,
              });
            }
          }}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
      </PopoverContent>
    </Popover>
  );
}
