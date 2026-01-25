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
  Users,
  Users2,
} from "lucide-react";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";
import { Room } from "@/types/room";
import { useParams } from "next/navigation";
import { Booking } from "@/types/booking";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookins";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { FunctionRoom } from "@/types/function-room";
import { FunctionHallBooking } from "@/types/function-room-booking";

export default function AssignRoomPage() {
  const { id } = useParams();
  const {
    function_hall_booking,
    isLoading: functionHallIsLoading,
    fetchBooking,
    updateBooking,
    error,
  } = useFunctionHallBookings();

  const {
    function_rooms,
    isLoading: roomIsLoading,
    fetchAvailableFunctionRooms,
    updateFunctionRoom,
  } = useFunctionRooms();

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
    }
  }, [id]);

  React.useEffect(() => {
    if (function_hall_booking.event_date) {
      fetchAvailableFunctionRooms({
        event_date: function_hall_booking.event_date,
        start: function_hall_booking.event_duration?.start,
        end: function_hall_booking.event_duration?.end,
      });
    }
  }, [function_hall_booking.event_date]);

  async function assignRoom(room: FunctionRoom, status: string) {
    await updateBooking({
      id: function_hall_booking.id,
      room_id: room.id,
      status: "reserved",
    } as FunctionHallBooking);

    await updateFunctionRoom({
      id: room.id,
      status: status,
      bookings: [...(room.bookings || []), function_hall_booking],
    });
    fetchBooking(id as string);
  }

  if (roomIsLoading || functionHallIsLoading) {
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
        {function_rooms.map((room) => (
          <Card
            key={room.id}
            isPressable
            className="hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <Image
              src={room.image}
              alt={room.id}
              className="rounded-t-xl h-40 w-xl object-cover"
            />
            <CardHeader className="flex flex-col items-start gap-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Room #{room.room_number}
              </h3>
              <p className="text-sm text-gray-500">{room.type}</p>
            </CardHeader>
            <CardBody className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2">
              <div className="flex w-full gap-4">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white flex gap-2">
                  <Users /> {room.max_guest}
                </h3>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white flex gap-2">
                  <Users2 /> {room.remaining_slots} (remaining slots)
                </h3>
              </div>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />{" "}
                {function_hall_booking.room_id !== room.id
                  ? room?.availability
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
            {function_hall_booking.room_id !== room.id ? (
              <>
                <Divider />
                <CardFooter className="flex gap-2">
                  <Button
                    onPress={() => assignRoom(room, "half occupied")}
                    fullWidth
                    isLoading={functionHallIsLoading}
                    color="primary"
                  >
                    Assign Half Room
                  </Button>

                  <Button
                    onPress={() => assignRoom(room, "half occupied")}
                    fullWidth
                    isLoading={functionHallIsLoading}
                    color="default"
                  >
                    Assign Full Room
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
