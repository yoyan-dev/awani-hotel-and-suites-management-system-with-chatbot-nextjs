import { Image, Chip, Button } from "@heroui/react";
import type { Room } from "@/types/room";
import { statusColorMap } from "@/app/constants/rooms";
import React from "react";
import { Edit } from "lucide-react";
import UpdateModal from "../modals/update-modal";

interface RenderCellProps {
  room: Room;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({ room, columnKey }) => {
  const cellValue = room[columnKey as keyof Room];
  const [updateOpen, setUpdateOpen] = React.useState(false);

  switch (columnKey) {
    case "room_type":
      return <Chip size="sm">{room.room_type?.name}</Chip>;
    case "status":
      return (
        <div>
          <Chip size="sm" color={statusColorMap[room.status || "default"]}>
            {room.status}
          </Chip>
        </div>
      );
    case "actions":
      return (
        <div>
          <UpdateModal
            room={room}
            isOpen={updateOpen}
            onClose={() => setUpdateOpen(false)}
          />
          <Button size="sm" color="primary" onPress={() => setUpdateOpen(true)}>
            <Edit size={13} />{" "}
            <span className="hidden md:block">Change status</span>
          </Button>
        </div>
      );
    default:
      return cellValue;
  }
};
