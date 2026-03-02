"use client";

import React, { useMemo } from "react";
import { Button, Card, Image, Link } from "@heroui/react";
import { UsersRound } from "lucide-react";

import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { formatPHP } from "@/lib/format-php";
import { peakSeason } from "@/lib/peak-season-dates";
import { RoomType } from "@/types/room";

import SkeletonLoader from "../skeleton-loader";

interface RoomProps {
  rooms: RoomType[];
  isLoading: boolean;
}

export const RoomsCarousel: React.FC<RoomProps> = ({ rooms, isLoading }) => {
  const isPeakSeason = useMemo(() => peakSeason(), []);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mb-10 text-center sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
          Featured Rooms
        </p>
        <h2 className="mt-3 font-serif text-3xl text-[#201e1a] sm:text-4xl">
          Rooms & Suites for every premium stay
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#675c4f] sm:text-base">
          Discover thoughtfully designed accommodations with modern amenities,
          upscale interiors, and comfortable spaces for business or leisure.
        </p>
      </div>

      <Carousel
        autoScroll
        autoScrollInterval={3400}
        itemsPerView={1}
        responsive={{ sm: 1, md: 2, lg: 3 }}
        className="max-w-[1320px]"
      >
        {rooms.map((room) => (
          <CarouselItem key={room.id}>
            <Card
              className="group h-full overflow-hidden rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-0 shadow-[0_20px_55px_-40px_rgba(36,30,23,0.55)] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_28px_70px_-40px_rgba(36,30,23,0.62)]"
              radius="none"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  removeWrapper
                  alt={room.name}
                  src={room.image || "/bg.jpg"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {isPeakSeason ? (
                  <span className="absolute left-4 top-4 rounded-full bg-[#8a4f29] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Peak Season
                  </span>
                ) : null}
              </div>

              <div className="flex h-[220px] flex-col justify-between p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-2xl capitalize text-[#221f1b]">
                      {room.name}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-[#7f735f]">
                      {room.room_size}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-[#6d6255]">
                    {room.description}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-[#6b5f50]">
                    <UsersRound size={15} />
                    Up to {room.max_guest} guests
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {!isPeakSeason ? (
                    <p className="text-lg font-semibold text-[#9c7645]">
                      {formatPHP(Number(room.price))}
                      <span className="ml-1 text-sm font-normal text-[#7b6f61]">
                        / night
                      </span>
                    </p>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-[#9f9587] line-through">
                        {formatPHP(Number(room.price))}
                      </span>
                      <span className="text-lg font-semibold text-[#9f4f2a]">
                        {formatPHP(Number(room.peak_season_price))}
                      </span>
                    </div>
                  )}

                  <Button
                    as={Link}
                    href={`/guest/reservations/hotel-rooms/reservation/${room.id}`}
                    radius="full"
                    className="bg-[#b08a53] px-5 font-semibold text-white hover:bg-[#9b7848]"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};
