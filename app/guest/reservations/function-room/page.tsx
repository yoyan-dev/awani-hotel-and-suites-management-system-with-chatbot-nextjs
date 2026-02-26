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

export default function Page() {
  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const [EventDuration, setEventDuration] = React.useState({
    start: "",
    end: "",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const {
    fetchBookings,
    isLoading: bookingIsLoading,
    addBooking,
  } = useFunctionHallBookings();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!guestId) {
      addToast({
        title: "Error",
        description: "Please register or select a guest first.",
        color: "warning",
      });
      return;
    }
    if (!EventDuration.start || !EventDuration.end) {
      addToast({
        title: "Error",
        description: "Please select event date and start/end time.",
        color: "warning",
      });
      return;
    }

    const eventStartISO = String(EventDuration.start);
    const eventEndISO = String(EventDuration.end);
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

    const fetchResult = await fetchBookings({ guest_id: guestId });
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

    formData.append("guest_id", guestId || "");
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
      // router.push("/");
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
                guestId={guestId}
                setGuestId={setGuestId}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                eventDuration={EventDuration}
                setEventDuration={setEventDuration}
                bookingIsLoading={bookingIsLoading}
              />
              {/* {room ? (
              <SelectedRoom room={room} isLoading={isLoading} />
            ) : (
              <AvailableRooms
                rooms={availabel_room_types}
                isLoading={isLoading}
                setSelectedRoom={setSelectedRoom}
              />
            )} */}
            </CardBody>
          </Card>
        </div>
      ) : (
        <SuccessMessage />
      )}
    </>
  );
}
