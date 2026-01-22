"use client";
import React from "react";
import { RoomsList } from "./_components/room-list";
import Header from "./_components/header";
import { FetchRoomTypesParams, RoomType } from "@/types/room";
import { formatDate } from "@/utils/format-date";
import { useRoomTypes } from "@/hooks/use-room-types";

export default function Page() {
  const today = new Date().toISOString().split("T")[0];
  const { availabel_room_types, isLoading, error, fetchAvailableRoomTypes } =
    useRoomTypes();
  const [desiredGuest, setDesiredGuest] = React.useState<string>();
  const [query, setQuery] = React.useState<FetchRoomTypesParams>({});

  React.useEffect(() => {
    fetchAvailableRoomTypes({ checkIn: today, checkOut: today });
  }, []);

  function checkAvailability() {
    fetchAvailableRoomTypes(query);
  }

  return (
    <div className="m-0 md:m-4 p-4 bg-white dark:bg-gray-800 space-y-4">
      <Header
        query={query}
        setQuery={setQuery}
        desiredGuest={desiredGuest}
        setDesiredGuest={setDesiredGuest}
        checkAvailability={checkAvailability}
      />
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-200">
          Current available rooms as of{" "}
          {query.checkIn
            ? formatDate(new Date(query.checkIn))
            : formatDate(new Date(today))}{" "}
          -{" "}
          {query.checkOut
            ? formatDate(new Date(query.checkOut))
            : formatDate(new Date(today))}
        </span>
        <RoomsList rooms={availabel_room_types} typesLoading={isLoading} />
      </div>
    </div>
  );
}
