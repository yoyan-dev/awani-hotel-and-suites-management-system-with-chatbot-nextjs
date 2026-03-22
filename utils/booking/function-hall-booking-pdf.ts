import { jsPDF } from "jspdf";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { formateDateAndTime } from "@/app/utils/to-date-range";
import { addValidIdImagesToPdf } from "@/utils/booking/pdf-valid-id-section";
import {
  drawHotelPdfCard,
  drawHotelPdfHeader,
  drawHotelPdfNotesCard,
  drawHotelPdfPageFrame,
  drawHotelPdfSignatureFooter,
} from "@/utils/booking/hotel-booking-pdf-layout";

interface DownloadFunctionHallBookingPdfOptions {
  booking: FunctionHallBooking;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: string;
}

function formatDateTime(value?: string | null) {
  return value ? (formateDateAndTime(value) ?? "-") : "-";
}

function formatDetail(value?: string | number | null) {
  return value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : String(value);
}

function formatMoney(value: number) {
  return `PHP ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function buildFunctionHallNarrative(booking: FunctionHallBooking) {
  return [
    `Event Type: ${formatDetail(booking.event_type)}`,
    `Assigned Room: ${formatDetail(booking.room?.room_number)}`,
    `Notes: ${formatDetail(booking.notes)}`,
  ].join("\n");
}

export async function downloadFunctionHallBookingPdf({
  booking,
  totalAmount,
  amountPaid,
  balance,
  paymentStatus,
}: DownloadFunctionHallBookingPdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 34;
  const pageWidth = doc.internal.pageSize.getWidth();
  const columnGap = 16;
  const columnWidth = (pageWidth - margin * 2 - columnGap) / 2;
  const generatedAt = formatDateTime(new Date().toISOString());

  drawHotelPdfPageFrame(doc);

  let y = await drawHotelPdfHeader({
    doc,
    margin,
    title: "Function Hall Booking Details",
    bookingNumber: formatDetail(booking.booking_number),
    status: formatDetail(booking.status),
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
      { label: "Guest Name", value: formatDetail(booking.guest?.full_name) },
      { label: "Contact", value: formatDetail(booking.guest?.contact_number) },
      { label: "Email", value: formatDetail(booking.guest?.email) },
      {
        label: "Source",
        value: formatDetail(booking.booking_source || "Online"),
      },
      { label: "Status", value: formatDetail(booking.status) },
    ],
  });

  drawHotelPdfCard({
    doc,
    x: margin + columnWidth + columnGap,
    y,
    width: columnWidth,
    height: 132,
    title: "Event Summary",
    rows: [
      { label: "Event Type", value: formatDetail(booking.event_type) },
      { label: "Guests", value: formatDetail(booking.number_of_guest) },
      { label: "Room", value: formatDetail(booking.room?.room_number) },
      { label: "Occupancy", value: formatDetail(booking.occupancy_type) },
      { label: "Booking No.", value: formatDetail(booking.booking_number) },
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
      { label: "Event Start", value: formatDateTime(booking.event_start) },
      { label: "Event End", value: formatDateTime(booking.event_end) },
      { label: "Created", value: formatDateTime(booking.created_at) },
      { label: "Status", value: formatDetail(booking.status) },
      { label: "Source", value: formatDetail(booking.booking_source) },
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
      { label: "Total Amount", value: formatMoney(totalAmount) },
      { label: "Amount Paid", value: formatMoney(amountPaid) },
      { label: "Balance", value: formatMoney(balance) },
      { label: "Method", value: formatDetail(booking.payment_method) },
      { label: "Payment Status", value: formatDetail(paymentStatus) },
    ],
  });

  y += 148;

  drawHotelPdfNotesCard({
    doc,
    x: margin,
    y,
    width: pageWidth - margin * 2,
    height: 90,
    title: "Event Notes",
    content: buildFunctionHallNarrative(booking),
  });

  y += 106;

  await addValidIdImagesToPdf({
    doc,
    y,
    margin,
    frontUrl: booking.guest?.valid_id?.front,
    backUrl: booking.guest?.valid_id?.back,
    title: "Valid ID Record",
    slotHeight: 108,
  });

  drawHotelPdfSignatureFooter(doc, {
    label: "Guest Signature over Printed Name",
  });

  doc.save(`function-hall-booking-${booking.booking_number || "details"}.pdf`);
}
