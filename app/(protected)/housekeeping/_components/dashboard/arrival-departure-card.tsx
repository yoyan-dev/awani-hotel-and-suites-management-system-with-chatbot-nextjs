"use client";

import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { RoomStatus } from "@/types/room";

interface Props {
  title: string;
  type: "arrival" | "departure";
  rooms: any[];
}

export function ArrivalDepartureCard({ title, type, rooms }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <h3 className="font-medium">{title}</h3>
      </CardHeader>

      <CardBody className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">Room {room.room_number}</p>
              <p className="text-xs text-gray-500">{room.guest_name}</p>
            </div>

            <Chip
              size="sm"
              color={type === "arrival" ? "primary" : "warning"}
              variant="flat"
            >
              {type.toUpperCase()}
            </Chip>
          </div>
        ))}

        {rooms.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No {type}s today 🎉
          </p>
        )}
      </CardBody>
    </Card>
  );
}
