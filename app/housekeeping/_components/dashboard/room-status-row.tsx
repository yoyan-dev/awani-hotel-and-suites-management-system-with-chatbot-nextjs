import { Chip, Button } from "@heroui/react";
import { RoomStatus } from "@/types/room";

interface Props {
  room: any;
}

export function RoomStatusRow({ room }: Props) {
  const statusColor = {
    dirty: "danger",
    cleaning: "warning",
    ready: "success",
    occupied: "default",
  };

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <p className="font-medium text-sm">Room {room.room_number}</p>
        <p className="text-xs text-gray-500">{room.guest_name || "—"}</p>
      </div>

      <div className="flex items-center gap-2">
        <Chip size="sm" variant="flat">
          {room.status?.toUpperCase()}
        </Chip>

        {room.status === "dirty" && (
          <Button size="sm" color="primary">
            Mark Ready
          </Button>
        )}
      </div>
    </div>
  );
}
