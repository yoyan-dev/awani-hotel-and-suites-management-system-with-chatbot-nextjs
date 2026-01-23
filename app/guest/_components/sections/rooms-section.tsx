"use client";
import React from "react";
import { RoomType } from "@/types/room";
import { Button, Card, CardBody, Image, Link, Spinner } from "@heroui/react";
import { ArrowUpRight, Bed, Tv, UserCircle, Wifi } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import SkeletonLoader from "../skeleton-loader";

interface RoomProps {
  rooms: RoomType[];
  isLoading: boolean;
}
export const RoomsAndSuites: React.FC<RoomProps> = ({ rooms, isLoading }) => {
  function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const randomRooms = shuffle(rooms).slice(0, 6);
  return (
    <div>
      {!isLoading ? (
        <section className="space-y-4 py-4">
          <div className="space-y-4 text-center">
            <h3>Rooms & Suites</h3>
            <h1 className="text-2xl">Explore Rooms And Suites</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto py-12">
            {randomRooms.map((room) => (
              <Card key={room.id} isHoverable>
                <CardBody className="dark:bg-gray-900">
                  <Image src="/bg.jpg" alt={room.name} className="rounded-lg" />
                  <div className="mt-4 flex flex-col h-full gap-4 justify-between">
                    <div>
                      <p className="font-semibold capitalize">{room.name}</p>
                      <p className="font-light text-gray-500">
                        {room.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Room Features
                      </h3>
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
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700">
                        {formatPHP(Number(room.price))}
                      </p>
                      <Button
                        color="primary"
                        as={Link}
                        href={`/guest/rooms/${room.id}`}
                      >
                        <ArrowUpRight />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto py-12">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
