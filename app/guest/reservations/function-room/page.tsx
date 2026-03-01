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

const guestTextFields = [
  "full_name",
  "contact_number",
  "address",
  "nationality",
  "gender",
  "email",
] as const;

function buildGuestFormData(source: FormData) {
  const guestFormData = new FormData();
  const generatedGuestId = crypto.randomUUID();
  guestFormData.append("id", generatedGuestId);

  for (const field of guestTextFields) {
    const value = source.get(field);
    if (typeof value === "string" && value.trim()) {
      guestFormData.append(field, value);
    }
  }

  const front = source.get("front");
  if (front instanceof File && front.size > 0) {
    guestFormData.append("front", front);
  }

  const back = source.get("back");
  if (back instanceof File && back.size > 0) {
    guestFormData.append("back", back);
  }

  return { guestFormData, generatedGuestId };
}

export default function Page() {
  const [selectedPackage, setSelectedPackage] = React.useState(null);
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
        description: "Invalid event duration. End time must be after start time.",
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
        <div className="min-h-screen pb-16">
          <Card className="border-none shadow-none">
            <CardHeader className="text-xl font-semibold text-center dark:bg-gray-900 ">
              Hotel Reservation
            </CardHeader>
            <CardBody className="dark:bg-gray-900  w-full flex flex-col lg:flex-row items-start gap-8">
              <BookingForm
                onSubmit={handleSubmit}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                eventDuration={eventDuration}
                setEventDuration={setEventDuration}
                bookingIsLoading={bookingIsLoading}
              />
            </CardBody>
          </Card>
        </div>
      ) : (
        <SuccessMessage />
      )}
    </>
  );
}
