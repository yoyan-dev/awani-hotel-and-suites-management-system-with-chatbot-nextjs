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
              ? "bg-gradient-to-b from-yellow-50 via-orange-100 to-red-100 dark:from-red-900 dark:via-red-950 dark:to-black animate-[pulse_3s_ease-in-out_infinite]"
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
            dotType="image"
            responsive={{ sm: 1, md: 2, lg: 3, xl: 3 }}
            className="max-w-7xl mx-auto"
          >
            {rooms.map((room) => (
              <CarouselItem key={room.id}>
                <Card
                  isFooterBlurred
                  as={Link}
                  href={`/guest/rooms/reservation/${room.id}`}
                  className={`w-full h-[320px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all relative
                  ${
                    isPeakSeason
                      ? "border-2 border-red-500/60 shadow-red-300/50 hover:scale-[1.03] dark:border-red-800 dark:shadow-red-900"
                      : "bg-gray-900/40 dark:bg-gray-800"
                  }`}
                >
                  {isPeakSeason && (
                    <div className="absolute inset-0 bg-red-200/20 dark:bg-red-900/20 animate-pulse pointer-events-none" />
                  )}

                  {/* Card Header */}
                  <CardHeader
                    className={`absolute z-10 top-3 left-3 flex-col items-start px-4 py-2 rounded-xl backdrop-blur-md
                    ${
                      isPeakSeason
                        ? "bg-red-600/70 text-white shadow-lg dark:bg-red-900/70"
                        : "bg-black/40 text-white"
                    }`}
                  >
                    <span className="uppercase text-xs font-semibold">
                      {isPeakSeason
                        ? "Peak Season Special"
                        : "Comfort & Luxury"}
                    </span>

                    <h4 className="font-semibold text-lg leading-tight">
                      {room.name}
                    </h4>

                    <div className="flex gap-2">
                      <span
                        className={`mt-1 px-2 py-1 text-xs font-medium rounded 
                        ${
                          isPeakSeason
                            ? "line-through bg-none text-gray-300 dark:text-gray-400"
                            : "bg-primary text-white"
                        }`}
                      >
                        {formatPHP(Number(room.price))}/night
                      </span>

                      <span
                        className={`mt-1 px-2 py-1 text-xs font-medium rounded 
                        ${isPeakSeason ? "bg-yellow-300 text-red-900 dark:bg-yellow-400 dark:text-red-950" : "hidden"}`}
                      >
                        {formatPHP(Number(room.peak_season_price))}/night
                      </span>
                    </div>
                  </CardHeader>

                  {/* Image */}
                  <Image
                    removeWrapper
                    alt={room.name}
                    className="z-0 w-full h-full object-cover"
                    src={room.image || "/bg.jpg"}
                  />

                  {/* Footer */}
                  <CardFooter
                    className={`absolute bottom-0 w-full backdrop-blur-md border-t px-4 py-3
                    ${
                      isPeakSeason
                        ? "bg-red-900/40 border-red-200/30 dark:bg-red-950/40 dark:border-red-900"
                        : "bg-black/30 border-white/10"
                    }`}
                  >
                    <p
                      className={`text-sm line-clamp-1
                      ${
                        isPeakSeason
                          ? "text-yellow-200 dark:text-yellow-300"
                          : "text-white/80"
                      }`}
                    >
                      {room.description}
                    </p>
                  </CardFooter>
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
