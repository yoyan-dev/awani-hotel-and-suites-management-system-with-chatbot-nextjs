import React from "react";
import { Image, Spinner } from "@heroui/react";
import { Bed, Tv, UserCircle, Wifi } from "lucide-react";

import { formatPHP } from "@/lib/format-php";
import { RoomType } from "@/types/room";

interface SelectedRoomProps {
  room: RoomType;
  isLoading: boolean;
}

const SelectedRoom: React.FC<SelectedRoomProps> = ({ room, isLoading }) => {
  if (isLoading || !room) {
    return (
      <div className="hidden h-64 items-center justify-center rounded-3xl border border-[#e8dccb] bg-[#fffaf2] md:flex">
        <Spinner size="lg" label="Loading room details..." />
      </div>
    );
  }

  return (
    <aside className="hidden space-y-5 rounded-3xl border border-[#e7dccd] bg-[#fffefb] p-5 xl:block">
      <div className="overflow-hidden rounded-2xl">
        {(room.images && room.images.length > 0
          ? room.images
          : room.image
            ? [room.image]
            : []
        )
          .slice(0, 1)
          .map((src, index) => (
            <Image
              key={`${src}-${index}`}
              src={src}
              alt="room image"
              width="100%"
              className="h-[260px] w-full object-cover"
            />
          ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl capitalize text-[#241f1a]">
              {room.name}
            </h2>
            <p className="text-sm text-[#766a5a]">{room.room_size}</p>
          </div>
          <p className="text-lg font-semibold text-[#9c7645]">
            {formatPHP(Number(room.price))}
          </p>
        </div>
        <p className="text-sm text-[#665d50]">{room.description}</p>
      </div>

      <div>
        <h3 className="font-serif text-xl text-[#251f17]">Room Features</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#665b4d]">
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#f2e8d9] px-3 py-2">
            <UserCircle size={16} /> {room.max_guest} Guests
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#f2e8d9] px-3 py-2">
            <Bed size={16} /> Queen Bed
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#f2e8d9] px-3 py-2">
            <Wifi size={16} /> Free WiFi
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#f2e8d9] px-3 py-2">
            <Tv size={16} /> Smart TV
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SelectedRoom;
