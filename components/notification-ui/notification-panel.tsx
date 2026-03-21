"use client";

import { Button, Divider, Spinner } from "@heroui/react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./notification-item";

interface Props {
  isLoading: boolean;
  notifications: Notification[];
  onClear: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function NotificationPanel({
  isLoading,
  notifications,
  onClear,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: Props) {
  return (
    <div
      className="max-h-[420px] overflow-y-auto w-full"
      onScroll={(event) => {
        const target = event.currentTarget;
        const nearBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight - 40;
        if (nearBottom && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 w-full">
        <h3 className="text-sm font-semibold">Notifications</h3>

        <Button
          isDisabled={notifications.length > 0}
          size="sm"
          variant="light"
          onPress={onClear}
          isLoading={isLoading}
        >
          Clear all
        </Button>
      </div>

      <Divider />

      <div className="p-3 space-y-2 w-full">
        {notifications.length === 0 ? (
          <p className="text-center text-sm opacity-60 py-6">
            No notifications
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))
        )}
        {isLoadingMore ? (
          <div className="flex justify-center py-3">
            <Spinner label="Loading more..." />
          </div>
        ) : null}
      </div>
    </div>
  );
}
