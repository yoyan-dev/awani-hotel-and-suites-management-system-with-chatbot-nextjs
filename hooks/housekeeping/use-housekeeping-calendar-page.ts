"use client";

import React from "react";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";
import { FetchBookingParams } from "@/types/booking";

export function useHousekeepingCalendarPage() {
  const calendarRef = React.useRef(null);
  const [query, setQuery] = React.useState<FetchBookingParams>({});
  const {
    room_types,
    isLoading: roomTypeLoading,
    fetchRoomTypes,
  } = useRoomTypes();
  const { rooms, isLoading: roomLoading, fetchRooms } = useRooms();
  const { bookings, fetchBookings } = useBookings();
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>("");
  const [selectedRoom, setSelectedRoom] = React.useState<string>("");

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  React.useEffect(() => {
    if (room_types && room_types.length > 0 && !selectedRoomType) {
      setSelectedRoomType(String(room_types[0].id));
    }
    if (rooms.length === 0) setSelectedRoom("no assigned");
    if (rooms && rooms.length > 0 && !roomLoading) {
      setSelectedRoom(String(rooms[0].id));
    }
  }, [room_types, rooms, selectedRoomType, roomLoading]);

  React.useEffect(() => {
    if (!selectedRoomType) return;
    const timer = setTimeout(() => {
      fetchRooms({ ...query, roomTypeID: selectedRoomType });
      fetchBookings({
        roomTypeID: selectedRoomType,
        room_id: selectedRoom !== "no assigned" ? selectedRoom : "",
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedRoomType, selectedRoom, query]);

  const selectedName =
    room_types?.find((t) => String(t.id) === selectedRoomType)?.name ??
    "Select room type";

  return {
    calendarRef,
    query,
    setQuery,
    roomTypes: room_types,
    roomTypeLoading,
    rooms,
    roomLoading,
    bookings,
    selectedRoomType,
    setSelectedRoomType,
    selectedRoom,
    setSelectedRoom,
    selectedName,
  };
}
