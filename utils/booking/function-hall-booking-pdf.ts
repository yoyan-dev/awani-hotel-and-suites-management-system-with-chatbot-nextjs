import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { formateDateAndTime } from "@/app/utils/to-date-range";

interface DownloadFunctionHallBookingPdfOptions {
  booking: FunctionHallBooking;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: string;
}

function formatFunctionHallDateTime(value?: string | null) {
  return value ? (formateDateAndTime(value) ?? "-") : "-";
}

function formatFunctionHallDetailValue(value?: string | number | null) {
  return value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : String(value);
}

function formatFunctionHallMoneyForPdf(value: number) {
  return `PHP ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function downloadFunctionHallBookingPdf({
  booking,
  totalAmount,
  amountPaid,
  balance,
  paymentStatus,
}: DownloadFunctionHallBookingPdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFontSize(16);
  doc.text("Function Hall Booking Details", margin, y);
  y += 18;

  doc.setFontSize(10);
  doc.text(`Booking #${booking.booking_number || "-"}`, margin, y);
  doc.text(`Status: ${booking.status || "Pending"}`, margin + 260, y);
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

  addSection("Booking Overview", [
    ["Booking Number", formatFunctionHallDetailValue(booking.booking_number)],
    ["Status", formatFunctionHallDetailValue(booking.status)],
    ["Booking Source", formatFunctionHallDetailValue(booking.booking_source)],
    [
      "Created At",
      booking.created_at ? formatFunctionHallDateTime(booking.created_at) : "",
    ],
  ]);

  addSection("Guest Information", [
    ["Guest Name", booking.guest?.full_name || "-"],
    ["Contact Number", booking.guest?.contact_number || "-"],
    ["Email", booking.guest?.email || "-"],
    ["Booking Source", booking.booking_source || "Online"],
  ]);

  addSection("Event Details", [
    ["Event Type", booking.event_type || "-"],
    [
      "Event Schedule",
      `${formatFunctionHallDateTime(booking.event_start)} - ${formatFunctionHallDateTime(booking.event_end)}`,
    ],
    ["Number of Guests", String(booking.number_of_guest || "-")],
    ["Assigned Room", formatFunctionHallDetailValue(booking.room?.room_number)],
    ["Occupancy Type", formatFunctionHallDetailValue(booking.occupancy_type)],
    ["Notes", booking.notes || "-"],
  ]);

  addSection("Payment Summary", [
    ["Total Amount", formatFunctionHallMoneyForPdf(totalAmount)],
    ["Amount Paid", formatFunctionHallMoneyForPdf(amountPaid)],
    ["Balance", formatFunctionHallMoneyForPdf(balance)],
    ["Payment Method", booking.payment_method || "Not set"],
    ["Payment Status", paymentStatus],
  ]);

  doc.save(`function-hall-booking-${booking.booking_number || "details"}.pdf`);
}
