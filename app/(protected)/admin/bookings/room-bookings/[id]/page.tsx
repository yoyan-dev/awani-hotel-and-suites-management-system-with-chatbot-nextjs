"use client";

import React from "react";
import { useParams } from "next/navigation";
import { calculateBookingPrice } from "@/utils/pricing";
import { useBookings } from "@/hooks/use-bookings";
import GuestModal from "./_components/modals/guest-details-modal";
import BookingHero from "./_components/sections/booking-hero";
import BookingAdditionalDetailsCard from "./_components/sections/booking-additional-details-card";
import BookingScheduleCard from "./_components/sections/booking-schedule-card";
import BookingSummaryCard from "./_components/sections/booking-summary-card";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { booking, isLoading, error, fetchBooking } = useBookings();
  const [viewOpen, setViewOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
    }
  }, [id, error]);

  if (isLoading || !booking) {
    return <div className="p-6">Loading...</div>;
  }

  const totalAmount =
    calculateBookingPrice(booking) + Number(booking.total_add_ons || 0);

  return (
    <div className="w-full mx-auto pb-4">
      <GuestModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        guest={booking.user}
      />

      <div className="px-4 py-2 text-white bg-primary mb-4">
        Booking Details
      </div>

      <BookingHero
        booking={booking}
        totalAmount={totalAmount}
        onViewGuest={() => setViewOpen(true)}
      />

      <BookingAdditionalDetailsCard company={booking.company} />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingScheduleCard booking={booking} />
        <BookingSummaryCard booking={booking} totalAmount={totalAmount} />
      </div>
    </div>
  );
}
