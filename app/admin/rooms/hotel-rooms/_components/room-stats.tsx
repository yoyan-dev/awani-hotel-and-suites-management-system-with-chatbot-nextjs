import { statusOptions } from "@/app/constants/rooms";
import { useRooms } from "@/hooks/use-rooms";
import { Room } from "@/types/room";
import { formatDate } from "@/utils/format-date";
import React from "react";

export default function RoomStats({
  available_rooms,
}: {
  available_rooms: Room[];
}) {
  const statusCounts = React.useMemo(() => {
    const stats = available_rooms.reduce(
      (acc: Record<string, number>, room: any) => {
        if (acc[room.status]) acc[room.status] += 1;
        else acc[room.status] = 1;
        return acc;
      },
      {}
    );
    return stats;
  }, [available_rooms]);

  const status = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));
  return (
    <div className="flex gap-4 flex-wrap px-2 pb-4">
      {status.map((item: any) => {
        const options = statusOptions.find((s) => s.uid === item.name);
        return (
          <div
            className="flex-1 p-3 rounded-lg bg-slate-50 dark:bg-gray-900"
            key={item.name}
          >
            <div className="text-xs text-slate-500 capitalize">
              {options?.name || item.name}
            </div>
            <div className="font-semibold text-lg">{item.count}</div>
          </div>
        );
      })}
    </div>
    // <div className="flex flex-col w-full gap-4 flex-wrap md:flex-row">

    //   <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4">
    //   </div>

    //   {/* <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4">
    //     <div className="font-medium mb-3">Quick actions</div>
    //     <div className="flex flex-col gap-2">
    //       <button className="w-full text-left px-4 py-2 rounded-lg bg-primary-600 text-white">
    //         Create Booking
    //       </button>
    //       <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-gray-900">
    //         Sync Calendar
    //       </button>
    //       <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-gray-900">
    //         Export CSV
    //       </button>
    //     </div>
    //   </div> */}
    // </div>
  );
}
