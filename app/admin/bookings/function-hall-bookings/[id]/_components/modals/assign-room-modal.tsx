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
  Spinner,
  Tooltip,
} from "@heroui/react";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";
import { useRooms } from "@/hooks/use-rooms";

function RoomDetail({
  label,
  value,
  spanFull = false,
}: {
  label: string;
  value: React.ReactNode;
  spanFull?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl bg-default-100 dark:bg-neutral-800 ${
        spanFull ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-xs text-default-700 dark:text-default-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

interface AssignRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (room: Room) => void;
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
  const { rooms, isLoading: roomsLoading, fetchRooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (booking.room_type_id) {
      fetchRooms({ roomTypeID: booking.room_type_id });
    }
  }, [booking.room_type_id]);

  const filterRoom = React.useMemo<Room | undefined>(() => {
    if (!selectedRoom) return booking.room;
    return rooms?.find((r) => r.id === selectedRoom);
  }, [selectedRoom, rooms, booking.room]);

  const handleAssign = () => {
    if (!filterRoom) return;
    onAssign(filterRoom);
  };

  const availableRooms = React.useMemo(() => {
    return rooms.map((room) => {
      const hasOverlap = room.bookings?.some(
        (b) => b.check_in < booking.check_out && b.check_out > booking.check_in
      );

      return {
        ...room,
        availability: hasOverlap
          ? "Not available on the selected date"
          : "Available on the selected date",
      };
    });
  }, [rooms, booking]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      size="xl"
      backdrop="blur"
      placement="center"
    >
      <ModalContent className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        <ModalHeader className="flex flex-col gap-1 text-center font-semibold text-lg">
          Assign Room to Booking
        </ModalHeader>

        <ModalBody className="space-y-4">
          {filterRoom?.images?.length ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
              {filterRoom.images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`Room image ${i + 1}`}
                  className="w-40 h-28 object-cover rounded-xl border"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-center text-default-500 italic">
              No images available for this room.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RoomDetail
              label="Room Number"
              value={filterRoom?.room_number ?? "N/A"}
            />
            <RoomDetail
              label="Room Type"
              value={filterRoom?.room_type?.name ?? "N/A"}
            />

            {filterRoom?.area && (
              <RoomDetail label="Area" value={filterRoom.area} />
            )}

            {filterRoom?.status && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-700 dark:text-default-400">
                  Status
                </p>
                <Chip
                  color={
                    filterRoom.status === "available"
                      ? "success"
                      : filterRoom.status === "occupied"
                        ? "danger"
                        : "warning"
                  }
                  variant="flat"
                  className="capitalize mt-1"
                >
                  {filterRoom.status}
                </Chip>
              </div>
            )}

            {filterRoom?.description && (
              <RoomDetail
                label="Description"
                value={filterRoom.description}
                spanFull
              />
            )}

            {filterRoom?.remarks && (
              <RoomDetail label="Remarks" value={filterRoom.remarks} spanFull />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-default-700 dark:text-default-400">
              Change / Select Another Room
            </p>

            {roomsLoading ? (
              <div className="flex justify-center py-4">
                <Spinner color="primary" label="Loading rooms..." />
              </div>
            ) : availableRooms?.length ? (
              <Select
                placeholder="Select a room"
                selectedKeys={
                  selectedRoom
                    ? [selectedRoom]
                    : booking.room?.id
                      ? [booking.room.id]
                      : []
                }
                onSelectionChange={(keys) =>
                  setSelectedRoom(Array.from(keys)[0] as string)
                }
                className="max-w-full"
              >
                {availableRooms.map((r: any) => (
                  <SelectItem key={r.id} textValue={String(r.room_number)}>
                    <div className="flex flex-col">
                      <span className="font-medium">Room {r.room_number}</span>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-default-700 dark:text-default-400">
                          {booking.room_id !== r.id
                            ? r.availability
                            : "Already selected"}
                        </span>
                        <Chip
                          size="sm"
                          color={
                            r.status === "available"
                              ? "success"
                              : r.status === "occupied"
                                ? "danger"
                                : "warning"
                          }
                          className="capitalize"
                        >
                          {r.status}
                        </Chip>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <p className="text-center text-default-500 text-sm italic">
                No rooms found for this room type.
              </p>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="justify-center">
          <Tooltip
            color="warning"
            content={
              filterRoom?.status !== "available"
                ? "Room must be available to assign"
                : ""
            }
          >
            <Button
              color="primary"
              variant="solid"
              className="rounded-full px-6"
              isDisabled={!filterRoom || filterRoom.status !== "available"}
              onPress={handleAssign}
              isLoading={bookingLoading}
            >
              Assign Room
            </Button>
          </Tooltip>
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
