"use client";
import React, { useMemo } from "react";
import { RoomType } from "@/types/room";
import { Card, CardFooter, CardHeader, Image, Link } from "@heroui/react";
import { formatPHP } from "@/lib/format-php";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import SkeletonLoader from "../skeleton-loader";
import { peakSeason } from "@/lib/peak-season-dates";

interface RoomProps {
  rooms: RoomType[];
  isLoading: boolean;
}

export const RoomsCarousel: React.FC<RoomProps> = ({ rooms, isLoading }) => {
  const isPeakSeason = useMemo(() => peakSeason(), []);

  return (
    <div>
      {!isLoading ? (
        <section
          className={`space-y-8 py-16 transition-all duration-500 
          ${
            isPeakSeason
              ? "bg-linear-to-b from-yellow-50 via-orange-100 to-red-100 dark:from-red-900 dark:via-red-950 dark:to-black animate-[pulse_3s_ease-in-out_infinite]"
              : "bg-gray-50 dark:bg-gray-900"
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h3
              className={`font-semibold tracking-wide uppercase transition-all 
              ${
                isPeakSeason
                  ? "text-red-600 dark:text-red-300 drop-shadow-md"
                  : "text-primary dark:text-primary-300"
              }`}
            >
              {isPeakSeason ? "✨ Peak Season Rates ✨" : "Rooms & Suites"}
            </h3>

            <h1
              className={`text-3xl md:text-4xl font-bold transition-all 
              ${
                isPeakSeason
                  ? "text-red-700 dark:text-red-200"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {isPeakSeason
                ? "Celebrate with Our Premium Rooms!"
                : "Explore Our Exquisite Room Collection"}
            </h1>

            <p
              className={`max-w-2xl mx-auto transition-all 
              ${
                isPeakSeason
                  ? "text-red-700/70 dark:text-red-300/70"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {isPeakSeason
                ? "Holiday rush? Enjoy upgraded comfort, festive ambiance, and peak-season exclusives!"
                : "Enjoy comfort, luxury, and modern amenities crafted for your perfect stay."}
            </p>
          </div>

          {/* Carousel */}
          <Carousel
            autoScroll
            autoScrollInterval={2500}
            itemsPerView={1}
            responsive={{ sm: 1, md: 2, lg: 3, xl: 3 }}
            className="max-w-7xl mx-auto"
          >
            {rooms.map((room) => (
              <CarouselItem key={room.id}>
                <Card
                  className="group w-full h-80 overflow-hidden rounded-lg
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        transition-all duration-300
        hover:shadow-lg dark:hover:shadow-neutral-950/40"
                >
                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      removeWrapper
                      alt={room.name}
                      src={room.image || "/bg.jpg"}
                      className="w-full h-full object-cover
            transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    {isPeakSeason && (
                      <span
                        className="absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-md
              bg-red-600 text-white"
                      >
                        Peak Season
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="h-[120px] px-4 py-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {room.name}
                      </h4>

                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {!isPeakSeason && (
                        <span className="font-medium text-primary">
                          {formatPHP(Number(room.price))}/night
                        </span>
                      )}

                      {isPeakSeason && (
                        <>
                          <span className="text-xs line-through text-neutral-400 dark:text-neutral-500">
                            {formatPHP(Number(room.price))}
                          </span>
                          <span className="font-semibold text-red-600 dark:text-red-500">
                            {formatPHP(Number(room.peak_season_price))}/night
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </Carousel>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto py-12">
          {[1, 2, 3].map((index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
