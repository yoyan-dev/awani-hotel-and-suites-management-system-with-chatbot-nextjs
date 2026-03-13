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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPHP } from "@/lib/format-php";
import { getNights } from "@/utils/pricing";

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

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = margin;
    const formatMoneyForPdf = (value: number) =>
      `PHP ${Number(value || 0)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    const title = "Room Booking Details";
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 18;

    doc.setFontSize(10);
    doc.text(`Booking #: ${booking.booking_number}`, margin, y);
    doc.text(`Status: ${booking.status}`, margin + 260, y);
    y += 14;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 16;

    const addSection = (label: string, rows: Array<[string, string]>) => {
      autoTable(doc, {
        startY: y,
        head: [[label, ""]],
        body: rows,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [176, 138, 83], textColor: 255 },
        columnStyles: { 0: { cellWidth: 170 } },
      });
      // @ts-expect-error - jspdf-autotable attaches lastAutoTable to doc
      y = doc.lastAutoTable.finalY + 14;
    };

    const formatDate = (value?: string | null) => {
      if (!value) return "-";
      const date = new Date(value);
      return date.toLocaleDateString();
    };

    addSection("Guest Information", [
      ["Guest Name", booking.user?.full_name || "-"],
      ["Contact Number", booking.user?.contact_number || "-"],
      ["Email", booking.user?.email || "-"],
      ["Company", booking.company || "N/A"],
    ]);

    addSection("Booking Details", [
      ["Room Type", booking.room_type?.name || "-"],
      ["Room Number", booking.room?.room_number || "-"],
      ["Check-in", formatDate(booking.checked_in)],
      ["Check-out", formatDate(booking.checked_out)],
      ["Guests", String(booking.number_of_guests || "-")],
      [
        "Nights",
        String(getNights(booking.checked_in, booking.checked_out) || 0),
      ],
    ]);

    if (booking.special_requests?.length) {
      const rows = booking.special_requests.map((req: any) => {
        const qty = Number(req.quantity || 0);
        const price = Number(req.price || 0) * qty;
        return [req.name || "-", String(qty), formatMoneyForPdf(price)] as [
          string,
          string,
          string,
        ];
      });
      autoTable(doc, {
        startY: y,
        head: [["Special Requests", "Qty", "Amount"]],
        body: rows,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [176, 138, 83], textColor: 255 },
        columnStyles: { 0: { cellWidth: 250 } },
      });
      // @ts-expect-error - jspdf-autotable attaches lastAutoTable to doc
      y = doc.lastAutoTable.finalY + 14;
    }

    addSection("Payment Summary", [
      ["Payment Method", booking.payment_method || "Not set"],
      ["Payment Status", booking.payment_status || "pending"],
      [
        `Total in ${getNights(booking.checked_in, booking.checked_out)} nights`,
        formatMoneyForPdf(calculateBookingPrice(booking)),
      ],
      ["Total Add-ons", formatMoneyForPdf(Number(booking.total_add_ons))],
      ["Total Amount", formatMoneyForPdf(totalAmount)],
      ["Amount Paid", formatMoneyForPdf(Number(booking.amount_paid) || 0)],
    ]);

    if (booking.request_messages) {
      addSection("Request Messages", [["Message", booking.request_messages]]);
    }

    doc.save(`room-booking-${booking.booking_number}.pdf`);
  };

  return (
    <div className="w-full mx-auto pb-4">
      <GuestModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        guest={booking.user}
      />

      <div className="w-full mx-auto pb-4">
        <div className="px-4 py-2 text-white bg-primary mb-4 flex items-center justify-between">
          <span>Booking Details</span>
          <button
            type="button"
            className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>
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
    </div>
  );
}
