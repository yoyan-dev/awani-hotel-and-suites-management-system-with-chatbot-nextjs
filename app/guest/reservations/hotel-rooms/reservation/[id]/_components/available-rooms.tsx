"use client";

import { Button, Card, CardBody, Image, Skeleton } from "@heroui/react";
import { formatPHP } from "@/lib/format-php";
import React from "react";
import { RoomType } from "@/types/room";
import ViewModal from "./modals/view-modal";

interface AvailableRoomProps {
  rooms: RoomType[];
  isLoading: boolean;
  setSelectedRoom: React.Dispatch<React.SetStateAction<any>>;
}

const AvailableRooms: React.FC<AvailableRoomProps> = ({
  rooms,
  isLoading,
  setSelectedRoom,
}) => {
  return (
    <div className="flex-1 space-y-4 hidden md:block">
      <h3 className="text-xl font-semibold">Available Rooms</h3>

      {isLoading ? (
        <Card className="space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {rooms.map((room) => (
            <Card key={room.id} isHoverable>
              <CardBody className="dark:bg-gray-800">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {room.image ? (
                    <Image
                      src={room.image}
                      alt={room.name}
                      width={300}
                      className="w-full md:w-48 h-auto object-cover rounded-md"
                    />
                  ) : null}
                  <div className="flex flex-col justify-between h-full w-full space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold capitalize">
                          {room.name}
                        </h2>
                        <span className="text-gray-500 dark:text-gray-300">
                          ({room.room_size})
                        </span>
                      </div>
                      <p className="text-primary text-sm">
                        {formatPHP(Number(room.price))}
                      </p>
                    </div>

                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                      {room.description}
                    </p>

                    <div className="flex gap-4 flex-wrap">
                      <Button
                        color="primary"
                        size="sm"
                        onPress={() => setSelectedRoom(room.id)}
                      >
                        Choose
                      </Button>
                      <ViewModal room={room} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
