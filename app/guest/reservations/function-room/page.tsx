"use client";

import BookingForm from "./_components/booking-form";
import { Card, CardBody, CardHeader } from "@heroui/react";
import SuccessMessage from "./_components/success-message";
import Footer from "../../_components/footer";
import { useGuestFunctionRoomReservationPage } from "@/hooks/guest/use-guest-function-room-reservation-page";

export default function Page() {
  const {
    eventDuration,
    setEventDuration,
    isSubmitted,
    bookingIsLoading,
    handleSubmit,
  } = useGuestFunctionRoomReservationPage();

  return (
    <>
      {!isSubmitted ? (
        <div className="min-h-screen py-8">
          <Card className="mx-auto w-full max-w-[1320px] rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] shadow-[0_30px_65px_-48px_rgba(35,29,22,0.5)]">
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
