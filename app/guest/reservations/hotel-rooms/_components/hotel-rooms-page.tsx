"use client";

import { RoomsList } from "./room-list";
import Header from "./header";
import { formatDate } from "@/utils/format-date";
import { useGuestHotelRoomsPage } from "@/hooks/guest/use-guest-hotel-rooms-page";

export function HotelRoomsPage() {
  const {
    rooms,
    isLoading,
    desiredGuest,
    setDesiredGuest,
    query,
    setQuery,
    today,
    tomorrow,
    checkAvailability,
  } = useGuestHotelRoomsPage();

  return (
    <div className="min-h-screen py-8">
      <section className="rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] p-4 shadow-[0_30px_65px_-48px_rgba(35,29,22,0.5)] sm:p-8">
        <Header
          query={query}
          setQuery={setQuery}
          desiredGuest={desiredGuest}
          setDesiredGuest={setDesiredGuest}
          checkAvailability={checkAvailability}
        />

        <div className="mt-6 rounded-2xl border border-[#eadfcf] bg-[#f7f1e8] px-4 py-3 text-sm text-[#675d51]">
          Current available rooms as of{" "}
          {query.checkIn
            ? formatDate(new Date(query.checkIn))
            : formatDate(new Date(today))}{" "}
          -{" "}
          {query.checkOut
            ? formatDate(new Date(query.checkOut))
            : formatDate(new Date(tomorrow))}
        </div>

        <div className="mt-6">
          <RoomsList rooms={rooms} typesLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
