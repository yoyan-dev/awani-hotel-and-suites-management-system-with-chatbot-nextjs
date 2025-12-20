import React from "react";
import { formatPHP } from "@/lib/format-php";
import { RoomType } from "@/types/room";
import { Image, Spinner } from "@heroui/react";
import { UserCircle, Bed, Wifi, Tv } from "lucide-react";
interface SelectedRoomProps {
  room: RoomType;
  isLoading: boolean;
}

const SelectedRoom: React.FC<SelectedRoomProps> = ({ room, isLoading }) => {
  if (isLoading || !room) {
    return (
      <div className="items-center justify-center h-64 hidden md:flex">
        <Spinner size="lg" label="Loading room details..." />
      </div>
    );
  }
  return (
    <div className="flex-1 hidden md:block">
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2 overflow-x-auto">
          {room.image ? (
            <Image src={room.image} alt="room image" width="100%" />
          ) : null}
        </div>
        <div className="flex justify-between items-center flex-wrap  w-full">
          <div className="flex gap-2">
            <h2 className="text-2xl font-semibold capitalize">{room.name}</h2>
            <span className="text-gray-500 dark:text-gray-300 ">
              ({room.room_size})
            </span>
          </div>
          <p className="text-xl font-semibold">
            {formatPHP(Number(room.price))}
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          {room.description}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Room Features</h3>
          <div className="flex gap-4 text-gray-700 flex-wrap">
            <div className="flex items-center gap-2">
              <UserCircle size={20} /> 2 Guests
            </div>
            <div className="flex items-center gap-2">
              <Bed size={20} /> 1 Queen Bed
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={20} /> Free WiFi
            </div>
            <div className="flex items-center gap-2">
              <Tv size={20} /> Smart TV
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedRoom;
