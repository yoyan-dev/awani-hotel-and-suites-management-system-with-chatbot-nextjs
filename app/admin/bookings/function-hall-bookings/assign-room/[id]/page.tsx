"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  SelectItem,
  Button,
  Divider,
  Image,
  Chip,
} from "@heroui/react";
import {
  Search,
  BedDouble,
  Building2,
  UserRound,
  CalendarDays,
  ArrowRightCircle,
} from "lucide-react";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";
import { Room } from "@/types/room";
import { useParams } from "next/navigation";
import { Booking } from "@/types/booking";

export default function AssignRoomPage() {
  const { id } = useParams();
  const {
    booking,
    isLoading: bookingLoading,
    fetchBooking,
    updateBooking,
    error,
  } = useBookings();
  const {
    rooms,
    isLoading: roomLoading,
    fetchAvailableRooms,
    updateRoom,
  } = useRooms();

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
    }
  }, [id, error]);

  React.useEffect(() => {
    if (booking.room_type_id) {
      fetchAvailableRooms({
        roomTypeID: booking.room_type_id,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
      });
    }
  }, [booking.room_type_id]);

  async function assignRoom(room: Room) {
    await updateBooking({
      id: booking.id,
      room_id: room.id,
      status: "confirmed",
    } as Booking);

    await updateRoom({
      id: room.id,
      bookings: [...(room.bookings || []), booking],
    });
    fetchBooking(id as string);
  }

  if (roomLoading || bookingLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <BedDouble className="w-6 h-6 text-primary" />
          Assign Room
        </h1>
      </div>

      <Divider className="mb-6" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            isPressable
            className="hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <Image
              src={room.images?.[0]}
              alt={room.room_id}
              className="rounded-t-xl h-40 w-xl object-cover"
            />
            <CardHeader className="flex flex-col items-start gap-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {room.room_number}
              </h3>
              <p className="text-sm text-gray-500">{room.room_type.name}</p>
            </CardHeader>
            <CardBody className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {room.area}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />{" "}
                {booking.room_id !== room.id
                  ? room.availability
                  : "Already selected"}
              </p>
              <Chip
                size="sm"
                color="success"
                variant="flat"
                className="w-fit mt-2"
              >
                {room.status}
              </Chip>
            </CardBody>
            {booking.room_id !== room.id ? (
              <>
                <Divider />
                <CardFooter>
                  <Button
                    onPress={() => assignRoom(room)}
                    fullWidth
                    isLoading={bookingLoading}
                    color="primary"
                    startContent={<ArrowRightCircle className="w-4 h-4" />}
                  >
                    Assign Room
                  </Button>
                </CardFooter>
              </>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
