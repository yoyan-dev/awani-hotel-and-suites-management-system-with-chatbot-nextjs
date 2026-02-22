"use client";

import React from "react";

import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";
import { CalendarView } from "./_components/calendar-view";
import { FetchBookingParams } from "@/types/booking";

export default function Calendar() {
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

  return (
    <div className="  space-y-4">
      <h1 className="text-2xl font-bold text-center bg-primary text-white py-2">
        Booking Calendar
      </h1>
      <div className=" p-2 md:p-4 bg-white dark:bg-gray-900 rounded">
        Bookings for{" "}
        <span className="font-bold text-primary">{selectedName}</span>
        <CalendarView
          query={query}
          setQuery={setQuery}
          rooms={rooms}
          calendarRef={calendarRef}
          bookings={bookings}
          selectedName={selectedName}
          roomTypeLoading={roomTypeLoading}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          roomTypes={room_types}
          roomLoading={roomLoading}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
      </div>
    </div>
  );
}
