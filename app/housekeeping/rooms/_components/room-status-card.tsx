import React from "react";
import { Card, Badge, Button } from "@heroui/react";
import { Users, Edit } from "lucide-react";
import type { Room } from "@/types/room";
import { ROOM_STATUS_CONFIG } from "@/app/constants/rooms";
import UpdateModal from "./modals/update-modal";

interface Props {
  room: Room;
  onUpdateStatus?: (roomId?: string, status?: string, remarks?: string) => void;
}

export default function RoomStatusCard({ room }: Props) {
  const [updateOpen, setUpdateOpen] = React.useState(false);

  // const statusConfig = ROOM_STATUS_CONFIG[room.name];

  return (
    <>
      <UpdateModal
        room={room}
        isOpen={updateOpen}
        onClose={() => setUpdateOpen(false)}
      />

      <Card className="rounded-md shadow-sm flex flex-col gap-4 border border-primary">
        {/* HEADER */}
        <div className="flex items-center justify-between bg-primary text-white p-4">
          <h3 className="text-lg font-semibold">Room {room.room_number}</h3>

          <span className="flex items-center gap-1 capitalize">
            {room.status?.replace(/[-_]/g, " ") || "N/A"}
          </span>
        </div>

        {/* ROOM TYPE */}
        {room.room_type && (
          <div className="text-sm text-gray-600 px-4">
            <div className="font-medium">{room.room_type.name}</div>
            <div className="flex items-center gap-1 text-xs">
              <Users size={14} />
              Max {room.room_type.max_guest} guests
            </div>
          </div>
        )}

        {/* REMARKS */}
        {room.remarks && (
          <p className="text-xs text-gray-500 italic px-4">“{room.remarks}”</p>
        )}

        {/* ACTION */}
        <div className="flex gap-2 mt-auto pb-4 px-4">
          <Button fullWidth size="sm" onPress={() => setUpdateOpen(true)}>
            <Edit size={13} />
            <span className="hidden md:block ml-1">Change status</span>
          </Button>
        </div>
      </Card>
    </>
  );
}
