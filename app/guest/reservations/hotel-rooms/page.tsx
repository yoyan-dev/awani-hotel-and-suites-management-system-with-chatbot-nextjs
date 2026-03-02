"use client";
import React from "react";
import { RoomsList } from "./_components/room-list";
import Header from "./_components/header";
import { FetchRoomTypesParams } from "@/types/room";
import { formatDate } from "@/utils/format-date";
import { useRoomTypes } from "@/hooks/use-room-types";

export default function Page() {
  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  const { availabel_room_types, isLoading, fetchAvailableRoomTypes } =
    useRoomTypes();
  const [desiredGuest, setDesiredGuest] = React.useState<number>(1);
  const [query, setQuery] = React.useState<FetchRoomTypesParams>({});

  React.useEffect(() => {
    fetchAvailableRoomTypes({
      checkIn: today,
      checkOut: tomorrow.toISOString().split("T")[0],
    });
  }, []);

  function checkAvailability() {
    fetchAvailableRoomTypes({ ...query, maxGuest: desiredGuest });
  }

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
          <RoomsList rooms={availabel_room_types} typesLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
