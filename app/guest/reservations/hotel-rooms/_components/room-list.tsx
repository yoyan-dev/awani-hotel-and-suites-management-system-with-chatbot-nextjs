import { formatPHP } from "@/lib/format-php";
import { RoomType } from "@/types/room";
import { Button, Card, CardBody, CardFooter, Image, Link } from "@heroui/react";
import { Ruler, UsersRound } from "lucide-react";
import React from "react";

import SkeletonLoader from "@/app/guest/_components/skeleton-loader";

interface RoomProps {
  rooms: RoomType[];
  typesLoading: boolean;
}

export const RoomsList: React.FC<RoomProps> = ({ rooms, typesLoading }) => {
  if (typesLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-[#eadfce] bg-[#f9f4ec]">
        <span className="text-sm text-[#6a6052]">
          No available rooms found.
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <Card
          isPressable
          key={room.id}
          className="group overflow-hidden rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-0 shadow-[0_20px_50px_-40px_rgba(34,29,22,0.52)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_30px_65px_-42px_rgba(34,29,22,0.58)]"
          radius="none"
        >
          <CardBody className="overflow-hidden p-0">
            <Image
              alt={room.name}
              className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              radius="none"
              src={room.images?.[0] ?? room.image ?? "/bg-awani.jpg"}
              width="100%"
            />
          </CardBody>

          <CardFooter className="p-5">
            <div className="flex h-full w-full flex-col items-start justify-between gap-3">
              <div className="flex items-start justify-between gap-2 w-full">
                <div>
                  <h3 className="font-serif text-2xl capitalize text-[#241f1a]">
                    {room.name}
                  </h3>
                </div>
                <p className="text-right text-lg font-semibold text-[#9c7645]">
                  {formatPHP(Number(room.price))}
                  <span className="block text-xs font-normal text-[#80725f]">
                    per night
                  </span>
                </p>
              </div>

              <p className="line-clamp-2 text-sm text-[#665d50]">
                {room.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6a5f50]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e6d5] px-3 py-1">
                  <Ruler size={14} />
                  {room.room_size}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e6d5] px-3 py-1">
                  <UsersRound size={14} />
                  {room.max_guest} guests
                </span>
              </div>

              <Button
                as={Link}
                href={`/guest/reservations/hotel-rooms/reservation/${room.id}`}
                fullWidth
                radius="full"
                className="mt-2 bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
              >
                Book Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
