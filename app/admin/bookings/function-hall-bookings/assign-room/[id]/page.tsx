"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  BedDouble,
  CalendarDays,
  Users,
  Users2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { FunctionRoom } from "@/types/function-room";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { addToast } from "@heroui/react";
import { useParams } from "next/navigation";

type OccupancyType = "available" | "half occupied" | "full occupied";

export default function AssignRoomPage() {
  const { id } = useParams();
  const {
    function_hall_booking,
    isLoading: functionHallIsLoading,
    fetchBooking,
    completeBooking,
    isLoading: completionLoading,
  } = useFunctionHallBookings();

  const {
    function_rooms,
    isLoading: roomIsLoading,
    fetchAvailableFunctionRooms,
  } = useFunctionRooms();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<FunctionRoom | null>(null);
  const [selectedOccupancy, setSelectedOccupancy] =
    useState<OccupancyType>("half occupied");

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

  const handleAssignRoom = (room: FunctionRoom, occupancy: OccupancyType) => {
    setSelectedRoom(room);
    setSelectedOccupancy(occupancy);
    onOpen();
  };

  const confirmAssignment = async () => {
    if (!selectedRoom || !function_hall_booking.id) return;

    try {
      await completeBooking(
        function_hall_booking.id,
        selectedRoom.id as string,
        selectedOccupancy,
      );
      onClose();
      addToast({
        title: "Success",
        description: "Room assigned successfully",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to assign room",
        color: "danger",
      });
    }
  };

  const getOccupancyColor = (occupancy: OccupancyType) => {
    switch (occupancy) {
      case "available":
        return "success";
      case "half occupied":
        return "warning";
      case "full occupied":
        return "danger";
      default:
        return "default";
    }
  };

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

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
          Booking Details
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Event:</span>
            <p className="font-medium">{function_hall_booking.event_type}</p>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium">{function_hall_booking.event_date}</p>
          </div>
          <div>
            <span className="text-gray-500">Guests:</span>
            <p className="font-medium">
              {function_hall_booking.number_of_guest}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <Chip
              size="sm"
              color={getOccupancyColor(
                function_hall_booking.status as OccupancyType,
              )}
            >
              {function_hall_booking.status}
            </Chip>
          </div>
        </div>
      </div>

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
                  <Users2 /> {room.remaining_slots} (remaining)
                </h3>
              </div>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {function_hall_booking.room_id !== room.id
                  ? room.availability
                  : "Already selected"}
              </p>
              <Chip
                size="sm"
                color={getOccupancyColor(room.status as OccupancyType)}
                variant="flat"
                className="w-fit mt-2"
              >
                {room.status}
              </Chip>
            </CardBody>
            {function_hall_booking.room_id !== room.id ? (
              <>
                <Divider />
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    onPress={() => handleAssignRoom(room, "half occupied")}
                    fullWidth
                    isLoading={completionLoading}
                    color="primary"
                    variant="flat"
                    startContent={<CheckCircle className="w-4 h-4" />}
                  >
                    Half Room
                  </Button>
                  <Button
                    onPress={() => handleAssignRoom(room, "full occupied")}
                    fullWidth
                    isLoading={completionLoading}
                    color="default"
                    startContent={<CheckCircle className="w-4 h-4" />}
                  >
                    Full Room
                  </Button>
                </CardFooter>
              </>
            ) : null}
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader>Confirm Room Assignment</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <p>
                Assign <strong>{selectedRoom?.room_number}</strong> for this
                booking?
              </p>
              <Chip
                color={getOccupancyColor(selectedOccupancy)}
                variant="flat"
                className="w-fit"
              >
                {selectedOccupancy === "half occupied"
                  ? "Half Occupied"
                  : "Fully Occupied"}
              </Chip>
              {selectedOccupancy === "full occupied" && (
                <div className="flex items-center gap-2 text-warning text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Room will be marked as fully occupied</span>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={confirmAssignment}
              isLoading={completionLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
