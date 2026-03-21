"use client";

import React from "react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { FunctionRoom } from "@/types/function-room";
import { OccupancyType } from "@/utils/function-room/occupancy";

export function useFunctionHallRoomAssignment(bookingId: string) {
  const {
    function_hall_booking,
    fetchBooking,
    updateBooking,
    isLoading: bookingLoading,
  } = useFunctionHallBookings();

  const {
    function_rooms,
    fetchAvailableFunctionRooms,
    updateFunctionRoom,
    isLoading: roomLoading,
  } = useFunctionRooms();

  const [selectedRoom, setSelectedRoom] = React.useState<FunctionRoom | null>(
    null,
  );
  const [selectedOccupancy, setSelectedOccupancy] =
    React.useState<OccupancyType>("half occupied");
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId);
    }
  }, [bookingId]);

  React.useEffect(() => {
    if (!function_hall_booking?.event_start || !function_hall_booking?.event_end)
      return;

    fetchAvailableFunctionRooms({
      start: function_hall_booking.event_start,
      end: function_hall_booking.event_end,
    });
  }, [function_hall_booking?.event_start, function_hall_booking?.event_end]);

  const summary = React.useMemo(
    () =>
      ({
        total_amount:
          (function_hall_booking?.banquet_package?.price_per_cover || 0) *
          (function_hall_booking?.number_of_guest || 0),
        balance:
          (function_hall_booking?.banquet_package?.price_per_cover || 0) *
          (function_hall_booking.number_of_guest || 0),
      }) as {
        total_amount: number;
        balance: number;
      },
    [function_hall_booking],
  );

  const handleAssign = (room: FunctionRoom, occupancy: OccupancyType) => {
    setSelectedRoom(room);
    setSelectedOccupancy(occupancy);
    setModalOpen(true);
  };

  const confirmAssignment = async () => {
    if (!selectedRoom || !function_hall_booking?.id) return;

    await updateBooking({
      id: function_hall_booking.id,
      room_id: selectedRoom.id,
      occupancy_type: selectedOccupancy,
      status: "confirmed",
      total_amount: summary.total_amount,
      balance: summary.balance,
    });

    await updateFunctionRoom({
      id: selectedRoom.id,
      status: selectedOccupancy,
    });

    setModalOpen(false);
    fetchBooking(bookingId);
  };

  return {
    booking: function_hall_booking,
    functionRooms: function_rooms,
    bookingLoading,
    roomLoading,
    selectedRoom,
    selectedOccupancy,
    modalOpen,
    setModalOpen,
    handleAssign,
    confirmAssignment,
  };
}
