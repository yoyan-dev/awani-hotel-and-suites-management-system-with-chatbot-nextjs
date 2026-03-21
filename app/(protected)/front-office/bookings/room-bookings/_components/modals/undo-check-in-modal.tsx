"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useBookings } from "@/hooks/use-bookings";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";

interface UndoCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export default function UndoCheckInModal({
  isOpen,
  onClose,
  booking,
}: UndoCheckInModalProps) {
  const { updateBooking, fetchBookings } = useBookings();
  const { updateRoom } = useRooms();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleUndo = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await updateBooking({ id: booking.id, status: "confirmed" } as Booking);

    if (booking.room_id) {
      await updateRoom({ id: booking.room_id, status: "vacant" } as any);
    }

    await fetchBookings({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onClose={onClose}
      size="md"
      radius="none"
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="bg-primary text-white">
              Undo Check-in
            </ModalHeader>
            <ModalBody className="pt-4 pb-2 space-y-3">
              <p className="text-sm text-default-700">
                This will revert the booking status to confirmed and mark the
                room as vacant.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="warning" isLoading={isSubmitting} onPress={handleUndo}>
                Undo Check-in
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
