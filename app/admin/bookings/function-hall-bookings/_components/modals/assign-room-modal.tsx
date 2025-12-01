"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Image,
  Select,
  SelectItem,
  Form,
} from "@heroui/react";
import { Room } from "@/types/room";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";

type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";

interface AssignRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (payload: Booking) => void;
  booking: Booking;
  bookingLoading: boolean;
}

export default function AssignRoomModal({
  isOpen,
  onClose,
  onAssign,
  booking,
  bookingLoading,
}: AssignRoomModalProps) {
  const {
    rooms,
    isLoading: roomsLoading,
    error: roomError,
    fetchRooms,
  } = useRooms();
  const [selectedRoom, setSelectedRoom] = React.useState<string>();

  const filterRoom = React.useMemo<Room>(() => {
    if (!selectedRoom) return booking.room;

    return rooms?.find((r) => r.id === selectedRoom);
  }, [selectedRoom]);

  React.useEffect(() => {
    if (booking.room_type_id) {
      fetchRooms({ roomTypeID: booking.room_type_id });
    }
    console.log(rooms);
  }, [roomError, booking.room_type_id]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose}
      size="xl"
      backdrop="blur"
      placement="center"
    >
      <ModalContent className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        <ModalHeader className="flex flex-col gap-1 text-center">
          Assign Room to Booking
        </ModalHeader>
        <ModalBody className="space-y-4">
          {filterRoom?.images && filterRoom?.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto">
              {filterRoom?.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Room image ${idx + 1}`}
                  className="w-40 h-28 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
              <p className="text-xs text-default-700 dark:text-default-400">
                Room Number
              </p>
              <p className="font-medium">{filterRoom?.room_number ?? "N/A"}</p>
            </div>
            <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
              <p className="text-xs text-default-700 dark:text-default-400">
                Room Type
              </p>
              <p className="font-medium">
                {filterRoom?.room_type?.name ?? "N/A"}
              </p>
            </div>
            {filterRoom?.area && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-700 dark:text-default-400">
                  Area
                </p>
                <p className="font-medium">{filterRoom?.area}</p>
              </div>
            )}
            {filterRoom?.status && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-700 dark:text-default-400">
                  Status
                </p>
                <Chip
                  color={
                    filterRoom?.status === "available"
                      ? "success"
                      : filterRoom?.status === "occupied"
                        ? "danger"
                        : "warning"
                  }
                  variant="flat"
                  className="capitalize"
                >
                  {filterRoom?.status}
                </Chip>
              </div>
            )}
            {filterRoom?.description && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-700 dark:text-default-400">
                  Description
                </p>
                <p className="font-medium">{filterRoom?.description}</p>
              </div>
            )}
            {filterRoom?.remarks && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-700 dark:text-default-400">
                  Remarks
                </p>
                <p className="font-medium">{filterRoom?.remarks}</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-default-700 dark:text-default-400">
              Change/Select Another Room
            </p>
            <Select
              isRequired
              placeholder="Select a room"
              name="room_id"
              isLoading={roomsLoading}
              value={selectedRoom}
              defaultSelectedKeys={[booking.room?.id]}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((r) => (
                <SelectItem key={r.id} textValue={String(r.room_number)}>
                  <div className="flex flex-col">
                    <span className="font-medium">Room {r.room_number}</span>
                    <div className="flex items-center justify-between flex-wrap gap-2 w-full">
                      <span className="text-xs text-default-700 dark:text-default-400">
                        {r.room_type?.name}
                      </span>
                      <Chip size="sm">{r.status}</Chip>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            color="primary"
            variant="solid"
            className="rounded-full px-6"
            isDisabled={!selectedRoom}
            onPress={() =>
              onAssign({
                id: booking.id,
                user: booking.user,
                room_id: selectedRoom || "",
                special_requests: booking.special_requests,
                check_in: booking.check_in,
                status: "confirmed",
              } as Booking)
            }
            isLoading={bookingLoading}
          >
            Assign Room
          </Button>
          <Button
            color="default"
            variant="flat"
            className="rounded-full px-6"
            onPress={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
