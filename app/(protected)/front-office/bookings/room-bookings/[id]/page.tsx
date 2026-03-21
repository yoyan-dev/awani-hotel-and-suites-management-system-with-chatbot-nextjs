"use client";

import { useParams } from "next/navigation";
import GuestModal from "./_components/modals/guest-details-modal";
import BookingHero from "./_components/sections/booking-hero";
import BookingAdditionalDetailsCard from "./_components/sections/booking-additional-details-card";
import BookingScheduleCard from "./_components/sections/booking-schedule-card";
import BookingSummaryCard from "./_components/sections/booking-summary-card";
import { useRoomBookingDetails } from "@/hooks/front-office/bookings/use-room-booking-details";
import { downloadRoomBookingPdf } from "@/utils/booking/room-booking-pdf";
import BookingDetailsHeader from "./_components/booking-details-header";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const bookingId = String(id);
  const { booking, isLoading, viewOpen, setViewOpen, totalAmount } =
    useRoomBookingDetails(bookingId);

  if (isLoading || !booking) {
    return <div className="p-6">Loading...</div>;
  }

  const handleDownloadPdf = () => {
    downloadRoomBookingPdf({
      booking,
      totalAmount,
    });
  };

  return (
    <div className="w-full mx-auto pb-4">
      <GuestModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        guest={booking.user}
      />

      <div className="w-full mx-auto pb-4">
        <BookingDetailsHeader onDownloadPdf={handleDownloadPdf} />

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
    </div>
  );
}
