"use client";

import React from "react";
import { useBookings } from "@/hooks/use-bookings";
import { calculateBookingPrice } from "@/utils/pricing";

export function useRoomBookingDetails(bookingId: string) {
  const { booking, isLoading, error, fetchBooking } = useBookings();
  const [viewOpen, setViewOpen] = React.useState(false);

  React.useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId);
    }
  }, [bookingId, error]);

  const totalAmount = booking
    ? calculateBookingPrice(booking) + Number(booking.total_add_ons || 0)
    : 0;

  return {
    booking,
    isLoading,
    viewOpen,
    setViewOpen,
    totalAmount,
  };
}
