import { statusColorMap, statusOptions } from "@/app/constants/rooms";
import { Circle } from "lucide-react";
import React from "react";

interface AnalyticsItem {
  name: string;
  count: number;
}

export default function RoomStats({
  analytics,
}: {
  analytics: AnalyticsItem[];
}) {
  return (
    <div className="flex gap-4 flex-wrap px-2 bg-gray-50 dark:bg-gray-800 mb-2">
      {analytics.map((item) => {
        const option = statusOptions.find((s) => s.uid === item.name);
        const colorClass = statusColorMap[item.name];
        return (
          <div
            key={item.name}
            className="flex items-center gap-3 p-4 rounded-lg "
          >
            <Circle
              size={12}
              className={`bg-${colorClass} text-${colorClass} rounded-full`}
            />
            <div className="font-bold text-sm text-gray-600 dark:text-gray-400">
              {item.count}
            </div>
            <div className="text-sm text-slate-500 dark:text-gray-400 capitalize">
              {option?.name || item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
