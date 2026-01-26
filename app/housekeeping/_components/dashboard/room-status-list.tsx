import { Card, CardHeader, CardBody } from "@heroui/react";
import { RoomStatus } from "@/types/room";
import { RoomStatusRow } from "./room-status-row";

interface Props {
  rooms: any[];
}

export function RoomStatusList({ rooms }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <h3 className="font-medium">Room Status</h3>
      </CardHeader>

      <CardBody className="space-y-1">
        {rooms.map((room) => (
          <RoomStatusRow key={room.id} room={room} />
        ))}
      </CardBody>
    </Card>
  );
}
