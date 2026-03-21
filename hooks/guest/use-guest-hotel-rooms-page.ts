"use client";

import React from "react";
import { FetchRoomTypesParams } from "@/types/room";
import { useRoomTypes } from "@/hooks/use-room-types";

export function useGuestHotelRoomsPage() {
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

  return {
    rooms: availabel_room_types,
    isLoading,
    desiredGuest,
    setDesiredGuest,
    query,
    setQuery,
    today,
    tomorrow,
    checkAvailability,
  };
}
