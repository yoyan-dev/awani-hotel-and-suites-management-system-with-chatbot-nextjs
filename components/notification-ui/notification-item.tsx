"use client";

import React from "react";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

interface Props {
  notification: Notification;
}

export function NotificationItem({ notification }: Props) {
  return (
    <div
      className={`p-3 rounded-md border-l-4 bg-gray-100 text-gray-800 shadow-sm ${notification.is_read ? "opacity-50" : ""} 
      `}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">{notification.title}</h4>
        {/* optional close button */}
        {/* <button className="ml-2 text-gray-500 hover:text-gray-700">&times;</button> */}
      </div>
      <p className="text-sm mt-1">{notification.message}</p>
      <span className="text-xs opacity-60 mt-1 block">
        {formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
        })}
      </span>
    </div>
  );
}
