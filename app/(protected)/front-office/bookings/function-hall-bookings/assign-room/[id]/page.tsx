"use client";

import { Divider } from "@heroui/react";
import { BedDouble, InfoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useFunctionHallRoomAssignment } from "@/hooks/front-office/bookings/use-function-hall-room-assignment";

import FunctionRoomCard from "./_components/function-room-card";
import AssignRoomModal from "./_components/modals/assign-room-modal";
import BookingDetails from "./_components/booking-details";

export default function Page() {
  const { id } = useParams();
  const bookingId = String(id);
  const {
    booking,
    functionRooms,
    bookingLoading,
    roomLoading,
    selectedRoom,
    selectedOccupancy,
    modalOpen,
    setModalOpen,
    handleAssign,
    confirmAssignment,
  } = useFunctionHallRoomAssignment(bookingId);

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

      <BookingDetails booking={booking} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {functionRooms.length > 0 ? (
          functionRooms.map((room) => (
            <FunctionRoomCard
              key={room.id}
              room={room}
              booking={booking}
              isLoading={bookingLoading}
              onAssign={handleAssign}
            />
          ))
        ) : (
          <div className="flex gap-2 items-center">
            <InfoIcon className="text-warning" /> No available rooms
          </div>
        )}
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
