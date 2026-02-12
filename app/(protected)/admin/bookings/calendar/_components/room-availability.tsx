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
  return (
    <div className="flex flex-col gap-4 px-2 pb-4">
      {available_rooms.map((room) => {
        return (
          <div>
            {room.room_number} - {room.availability}
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
