"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import React from "react";
import { Booking } from "@/types/booking";
import { useRooms } from "@/hooks/use-rooms";
import { useBookings } from "@/hooks/use-bookings";

interface ExtendModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

const ExtendModal: React.FC<ExtendModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [extendedDate, setExtendedDate] = React.useState<string>(
    booking.checked_out,
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const {
    available_rooms,
    isLoading: roomIsLoading,
    fetchAvailableRooms,
  } = useRooms();
  const { isLoading: bookingIsLoading, updateBooking } = useBookings();

  React.useEffect(() => {
    if (isOpen) {
      setExtendedDate(booking.checked_out);
      setErrorMessage("");
    }
  }, [booking.checked_out, isOpen]);

  const isInvalid = React.useMemo(() => {
    setErrorMessage("");
    if (extendedDate === booking.checked_out) return false;
    if (!extendedDate) {
      setErrorMessage("Please select a valid date");
      return true;
    }

    const currentCheckout = new Date(booking.checked_out);
    const newCheckout = new Date(extendedDate);

    if (newCheckout <= currentCheckout) {
      setErrorMessage(
        "Extended date must be greater than the current check-out date",
      );
      return true;
    }

    if (available_rooms.length === 0 && !roomIsLoading) {
      setErrorMessage("Selected room is not available on this date");
      return true;
    }

    return false;
  }, [extendedDate, booking.checked_out, available_rooms, roomIsLoading]);

  React.useEffect(() => {
    if (!booking.id || extendedDate === booking.checked_out) return;

    fetchAvailableRooms({
      checkIn: booking.checked_out,
      checkOut: extendedDate,
      roomId: booking.room.room_id,
    });
  }, [extendedDate, booking.id]);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Extend Stay – {booking.booking_number}</ModalHeader>

            <ModalBody>
              <Input
                type="date"
                label="New Check-out Date"
                value={extendedDate}
                onChange={(e) => setExtendedDate(e.target.value)}
                isInvalid={isInvalid}
                errorMessage={errorMessage}
                isDisabled={roomIsLoading}
                isRequired
                variant="bordered"
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>

              <Button
                color="primary"
                isDisabled={isInvalid || roomIsLoading}
                isLoading={roomIsLoading || bookingIsLoading}
                onPress={() =>
                  updateBooking({
                    id: booking.id,
                    checked_out: extendedDate,
                  } as Booking)
                }
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExtendModal;
