"use client";

import React from "react";

import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";
import { CalendarView } from "./_components/calendar-view";

export default function Calendar() {
  const calendarRef = React.useRef(null);
  const {
    room_types,
    isLoading: roomTypeLoading,
    fetchRoomTypes,
  } = useRoomTypes();

  const { rooms, isLoading: roomLoading, fetchRooms } = useRooms();
  const { bookings, isLoading: bookingsLoading, fetchBookings } = useBookings();

  const [selectedRoomType, setSelectedRoomType] = React.useState<string>("");

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  React.useEffect(() => {
    if (room_types && room_types.length > 0 && !selectedRoomType) {
      setSelectedRoomType(String(room_types[0].id));
    }
  }, [room_types]);

  React.useEffect(() => {
    if (!selectedRoomType) return;
    const timer = setTimeout(() => {
      fetchRooms({
        roomTypeID: selectedRoomType,
      });
      fetchBookings({ roomTypeID: selectedRoomType });
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedRoomType]);

  const selectedName =
    room_types?.find((t) => String(t.id) === selectedRoomType)?.name ??
    "Select room type";

  return (
    <div className="  space-y-4">
      <h1 className="text-2xl font-bold text-center bg-primary text-white py-2">
        Booking Calendar
      </h1>
      <div className=" p-2 md:p-4 bg-white dark:bg-gray-900 rounded">
        {/* <RoomAvailability available_rooms={available_rooms} /> */}
        <CalendarView
          rooms={rooms}
          calendarRef={calendarRef}
          bookings={bookings}
          selectedName={selectedName}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          roomType={room_types}
        />
      </div>
      {/* {!roomLoading && !bookingsLoading && selectedRoomType ? (
        <CalendarView
          calendarRef={calendarRef}
          rooms={rooms}
          bookings={bookings}
        />
      ) : (
        <div className="p-4">
          <Card className="w-full shadow-none" radius="none">
            <Skeleton className="rounded-sm">
              <div className="h-24 w-full rounded-lg bg-default-300" />
            </Skeleton>
          </Card>
        </div>
      )} */}
    </div>
  );
}
