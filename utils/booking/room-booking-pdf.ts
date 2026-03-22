import { jsPDF } from "jspdf";
import { Booking } from "@/types/booking";
import { getNights } from "@/utils/pricing";
import { formatBookingGuestSummary } from "@/lib/booking/guest-breakdown";
import { addValidIdImagesToPdf } from "@/utils/booking/pdf-valid-id-section";
import {
  drawHotelPdfCard,
  drawHotelPdfHeader,
  drawHotelPdfNotesCard,
  drawHotelPdfPageFrame,
  drawHotelPdfSignatureFooter,
} from "@/utils/booking/hotel-booking-pdf-layout";

interface DownloadRoomBookingPdfOptions {
  booking: Booking;
  totalAmount: number;
}

function formatMoney(value: number) {
  return `PHP ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

function compactValue(value?: string | number | null) {
  return value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : String(value);
}

function summarizeSpecialRequests(booking: Booking) {
  if (!booking.special_requests?.length) {
    return "No special requests recorded.";
  }

  const summary = booking.special_requests
    .slice(0, 3)
    .map((item: any) => `${item.name || "Request"} x${Number(item.quantity || 0)}`)
    .join(", ");

  if (booking.special_requests.length > 3) {
    return `${summary}, +${booking.special_requests.length - 3} more`;
  }

  return summary;
}

function buildRoomBookingNarrative(booking: Booking) {
  const roomDescription = compactValue(booking.room_type?.description);
  const requestMessage = compactValue(booking.request_messages);
  const specialRequests = summarizeSpecialRequests(booking);

  return [
    `Room Details: ${roomDescription}`,
    `Guest Notes: ${requestMessage}`,
    `Special Requests: ${specialRequests}`,
  ].join("\n");
}

export async function downloadRoomBookingPdf({
  booking,
  totalAmount,
}: DownloadRoomBookingPdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 34;
  const pageWidth = doc.internal.pageSize.getWidth();
  const columnGap = 16;
  const columnWidth = (pageWidth - margin * 2 - columnGap) / 2;
  const balanceDue = Math.max(totalAmount - Number(booking.amount_paid || 0), 0);
  const nights = getNights(booking.checked_in, booking.checked_out) || 0;
  const generatedAt = formatDateTime(new Date().toISOString());

  drawHotelPdfPageFrame(doc);

  let y = await drawHotelPdfHeader({
    doc,
    margin,
    title: "Room Booking Details",
    bookingNumber: compactValue(booking.booking_number),
    status: compactValue(booking.status),
    generatedAt,
  });

  drawHotelPdfCard({
    doc,
    x: margin,
    y,
    width: columnWidth,
    height: 132,
    title: "Guest Information",
    rows: [
      { label: "Guest Name", value: compactValue(booking.user?.full_name) },
      { label: "Contact", value: compactValue(booking.user?.contact_number) },
      { label: "Email", value: compactValue(booking.user?.email) },
      { label: "Company", value: compactValue(booking.company || "N/A") },
      { label: "Status", value: compactValue(booking.status) },
    ],
  });

  drawHotelPdfCard({
    doc,
    x: margin + columnWidth + columnGap,
    y,
    width: columnWidth,
    height: 132,
    title: "Stay Summary",
    rows: [
      { label: "Room Type", value: compactValue(booking.room_type?.name) },
      { label: "Room No.", value: compactValue(booking.room?.room_number) },
      { label: "Room Status", value: compactValue(booking.room?.status) },
      { label: "Guests", value: formatBookingGuestSummary(booking) },
      { label: "Nights", value: String(nights) },
    ],
  });

  y += 148;

  drawHotelPdfCard({
    doc,
    x: margin,
    y,
    width: columnWidth,
    height: 132,
    title: "Schedule",
    rows: [
      { label: "Check-in", value: formatDate(booking.checked_in) },
      { label: "Check-out", value: formatDate(booking.checked_out) },
      { label: "Booked Via", value: compactValue(booking.booking_source) },
      { label: "Created", value: formatDate(booking.created_at) },
      { label: "Booking No.", value: compactValue(booking.booking_number) },
    ],
  });

  drawHotelPdfCard({
    doc,
    x: margin + columnWidth + columnGap,
    y,
    width: columnWidth,
    height: 132,
    title: "Payment",
    rows: [
      { label: "Payment Method", value: compactValue(booking.payment_method) },
      { label: "Payment Status", value: compactValue(booking.payment_status) },
      {
        label: "Amount Paid",
        value: formatMoney(Number(booking.amount_paid) || 0),
      },
      { label: "Total Amount", value: formatMoney(totalAmount) },
      { label: "Balance Due", value: formatMoney(balanceDue) },
    ],
  });

  y += 148;

  drawHotelPdfNotesCard({
    doc,
    x: margin,
    y,
    width: pageWidth - margin * 2,
    height: 90,
    title: "Booking Notes",
    content: buildRoomBookingNarrative(booking),
  });

  y += 106;

  await addValidIdImagesToPdf({
    doc,
    y,
    margin,
    frontUrl: booking.user?.valid_id?.front,
    backUrl: booking.user?.valid_id?.back,
    title: "Valid ID Record",
    slotHeight: 108,
  });

  drawHotelPdfSignatureFooter(doc, {
    label: "Guest Signature over Printed Name",
  });

  doc.save(`room-booking-${booking.booking_number}.pdf`);
}
