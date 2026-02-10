"use client";

import { Button, Divider } from "@heroui/react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./notification-item";

interface Props {
  isLoading: boolean;
  notifications: Notification[];
  onClear: () => void;
}

export function NotificationPanel({
  isLoading,
  notifications,
  onClear,
}: Props) {
  return (
    <div className="max-h-[420px] overflow-y-auto w-full">
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
      </div>
    </div>
  );
}
