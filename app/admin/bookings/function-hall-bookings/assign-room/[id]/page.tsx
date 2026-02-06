"use client";

import React, { useEffect, useState } from "react";
import { Divider } from "@heroui/react";
import { BedDouble } from "lucide-react";
import { useParams } from "next/navigation";

import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { FunctionRoom } from "@/types/function-room";
import FunctionRoomCard from "./_components/function-room-card";
import AssignRoomModal from "./_components/modals/assign-room-modal";
import BookingDetails from "./_components/booking-details";
import { OccupancyType } from "@/utils/function-room/occupancy";
import { BanquetPackage } from "@/types/banquet";

export default function Page() {
  const { id } = useParams();

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

  const [selectedRoom, setSelectedRoom] = useState<FunctionRoom | null>(null);
  const [selectedOccupancy, setSelectedOccupancy] =
    useState<OccupancyType>("half occupied");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchBooking(id as string);
  }, [id]);

  useEffect(() => {
    if (!function_hall_booking?.event_date) return;

    fetchAvailableFunctionRooms({
      event_date: function_hall_booking.event_date,
      start: function_hall_booking.event_duration?.start,
      end: function_hall_booking.event_duration?.end,
    });
  }, [function_hall_booking?.event_date]);

  const handleAssign = (room: FunctionRoom, occupancy: OccupancyType) => {
    setSelectedRoom(room);
    setSelectedOccupancy(occupancy);
    setModalOpen(true);
  };

  const summary = React.useMemo(() => {
    return {
      total_amount:
        (function_hall_booking?.banquet_package?.price_per_cover || 0) *
        (function_hall_booking?.number_of_guest || 0),
      balance:
        (function_hall_booking?.banquet_package?.price_per_cover || 0) *
        (function_hall_booking.number_of_guest || 0),
    } as {
      total_amount: number;
      balance: number;
    };
  }, [function_hall_booking]);

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
    fetchBooking(id as string);
  };

  if (bookingLoading || roomLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold flex gap-2 mb-6">
        <BedDouble className="text-primary" />
        Assign Room
      </h1>

      <Divider className="mb-6" />

      <BookingDetails booking={function_hall_booking} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {function_rooms.map((room) => (
          <FunctionRoomCard
            key={room.id}
            room={room}
            booking={function_hall_booking}
            isLoading={bookingLoading}
            onAssign={handleAssign}
          />
        ))}
      </div>

      <AssignRoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={selectedRoom}
        occupancy={selectedOccupancy}
        isLoading={bookingLoading}
        onConfirm={confirmAssignment}
      />
    </div>
  );
}
