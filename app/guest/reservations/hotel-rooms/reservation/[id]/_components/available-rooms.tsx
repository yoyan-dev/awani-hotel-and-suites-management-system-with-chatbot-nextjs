"use client";

import React from "react";
import { Button, Card, CardBody, Image, Skeleton } from "@heroui/react";

import { formatPHP } from "@/lib/format-php";
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
    <aside className="hidden flex-1 space-y-4 rounded-3xl border border-[#e7dccd] bg-[#fffefb] p-5 xl:block">
      <h3 className="font-serif text-2xl text-[#281f14]">Available Rooms</h3>

      {isLoading ? (
        <Card
          className="space-y-5 rounded-2xl border border-[#e4d9c8] bg-[#fffaf1] p-4"
          radius="none"
        >
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
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="rounded-2xl border border-[#e8ddcc] bg-[#fcf8f2]"
              radius="none"
            >
              <CardBody>
                <div className="flex flex-col items-start gap-4">
                  {room.images?.[0] || room.image ? (
                    <Image
                      src={room.images?.[0] ?? room.image}
                      alt={room.name}
                      width={300}
                      className="h-[160px] w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="font-serif text-xl capitalize text-[#231f1a]">
                          {room.name}
                        </h2>
                        <span className="text-sm text-[#726654]">
                          {room.room_size}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#9c7645]">
                        {formatPHP(Number(room.price))}
                      </p>
                    </div>

                    <p className="text-sm text-[#655b4d]">{room.description}</p>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="bg-[#b08a53] text-white hover:bg-[#9d7948]"
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
    </aside>
  );
};

export default AvailableRooms;
