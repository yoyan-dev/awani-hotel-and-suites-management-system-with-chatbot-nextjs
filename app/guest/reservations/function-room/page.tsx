"use client";

import BookingForm from "./_components/booking-form";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import SuccessMessage from "./_components/success-message";
import {
  fetchBookings as fetchFunctionHallBookings,
  addBooking as addFunctionHallBooking,
} from "@/features/booking/function-hall/booking-thunk";
import { parseISODateTime } from "@/utils/function-room/event-duration-date";
import { useGuests } from "@/hooks/use-guests";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { buildGuestFormData } from "@/app/guest/reservations/_utils/build-guest-form-data";
import Footer from "../../_components/footer";

export default function Page() {
  const [eventDuration, setEventDuration] = React.useState({
    start: "",
    end: "",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { addGuest } = useGuests();
  const {
    fetchBookings,
    isLoading: bookingIsLoading,
    addBooking,
  } = useFunctionHallBookings();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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
    const fetchResult = await fetchBookings({ guest_id: createdGuestId });
    if (fetchFunctionHallBookings.fulfilled.match(fetchResult)) {
      const hasActiveBooking = fetchResult.payload.data.some(
        (booking) =>
          booking.status !== "cancelled" && booking.status !== "completed",
      );
      if (hasActiveBooking) {
        addToast({
          title: "Error!",
          description:
            "You still have a pending booking reservation. Please contact awani customer service for assistance.",
          color: "warning",
        });
        return;
      }
    } else {
      addToast({
        title: "Error!",
        description: "Unable to validate existing bookings. Please try again.",
        color: "danger",
      });
      return;
    }

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
  }

  return (
    <>
      {!isSubmitted ? (
        <div className="min-h-screen py-8">
          <Card className="mx-auto w-full max-w-[1320px] rounded-[2rem] border border-[#e3d8c8] bg-[#fffdf8] shadow-[0_30px_65px_-48px_rgba(35,29,22,0.5)]">
            <CardHeader className="flex flex-col items-start gap-3 border-b border-[#eadfce] bg-[#f8f1e8] px-5 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#987345]">
                Event Reservation
              </p>
              <h1 className="font-serif text-3xl tracking-tight text-[#231f1a] md:text-4xl">
                Function Room Reservation
              </h1>
              <p className="text-sm text-[#645b4e]">
                Plan your event with confidence. Complete the form below and our
                team will review your reservation request.
              </p>
            </CardHeader>
            <CardBody className="w-full gap-8 p-4 sm:p-6 lg:p-8">
              <BookingForm
                onSubmit={handleSubmit}
                eventDuration={eventDuration}
                setEventDuration={setEventDuration}
                bookingIsLoading={bookingIsLoading}
              />
            </CardBody>
          </Card>
          <Footer />
        </div>
      ) : (
        <SuccessMessage />
      )}
    </>
  );
}
