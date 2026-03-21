"use client";

import React from "react";
import { addToast } from "@heroui/react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import {
  addBooking as addFunctionHallBooking,
} from "@/features/booking/function-hall/booking-thunk";
import { parseISODateTime } from "@/utils/function-room/event-duration-date";
import { useGuests } from "@/hooks/use-guests";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { buildGuestFormData } from "@/utils/guest/build-guest-form-data";

export function useGuestFunctionRoomReservationPage() {
  const [eventDuration, setEventDuration] = React.useState({
    start: "",
    end: "",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const submitLockRef = React.useRef(false);
  const { addGuest } = useGuests();
  const {
    isLoading: bookingIsLoading,
    addBooking,
  } = useFunctionHallBookings();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (!eventDuration.start || !eventDuration.end) {
        addToast({
          title: "Error",
          description: "Please select event date and start/end time.",
          color: "warning",
        });
        return;
      }

      const eventStartISO = String(eventDuration.start);
      const eventEndISO = String(eventDuration.end);
      const eventStart = parseISODateTime(eventStartISO);
      const eventEnd = parseISODateTime(eventEndISO);

      if (!eventStart || !eventEnd || eventStart >= eventEnd) {
        addToast({
          title: "Error",
          description:
            "Invalid event duration. End time must be after start time.",
          color: "warning",
        });
        return;
      }

      const { guestFormData, generatedGuestId } = buildGuestFormData(formData);
      const addGuestResult = await addGuest(guestFormData);
      if (!addGuestThunk.fulfilled.match(addGuestResult)) {
        addToast({
          title: "Guest Registration Failed",
          description:
            "We could not save guest information. Please review your details and try again.",
          color: "danger",
        });
        return;
      }

      const createdGuestId = addGuestResult.payload.id || generatedGuestId;

      formData.append("guest_id", createdGuestId);
      formData.append("event_start", eventStartISO);
      formData.append("event_end", eventEndISO);

      const addResult = await addBooking(formData);
      if (addFunctionHallBooking.fulfilled.match(addResult)) {
        addToast({
          title: "Reservation Successful",
          description:
            "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
          color: "success",
        });
        setIsSubmitted(true);
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return {
    eventDuration,
    setEventDuration,
    isSubmitted,
    bookingIsLoading: bookingIsLoading || isSubmitting,
    handleSubmit,
  };
}
