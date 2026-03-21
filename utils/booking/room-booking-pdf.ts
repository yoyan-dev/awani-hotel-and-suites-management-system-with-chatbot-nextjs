import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Booking } from "@/types/booking";
import { calculateBookingPrice, getNights } from "@/utils/pricing";
import { formatBookingGuestSummary } from "@/lib/booking/guest-breakdown";

interface DownloadRoomBookingPdfOptions {
  booking: Booking;
  totalAmount: number;
}

function formatRoomBookingMoneyForPdf(value: number) {
  return `PHP ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatRoomBookingDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function formatRoomBookingDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

function formatRoomBookingValue(value?: string | number | null) {
  return value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : String(value);
}

export function downloadRoomBookingPdf({
  booking,
  totalAmount,
}: DownloadRoomBookingPdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;
  const balanceDue = Math.max(totalAmount - Number(booking.amount_paid || 0), 0);

  doc.setFontSize(16);
  doc.text("Room Booking Details", margin, y);
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

  addSection("Guest Information", [
    ["Guest Name", booking.user?.full_name || "-"],
    ["Contact Number", booking.user?.contact_number || "-"],
    ["Email", booking.user?.email || "-"],
    ["Company", booking.company || "N/A"],
  ]);

  addSection("Booking Overview", [
    ["Booking Number", formatRoomBookingValue(booking.booking_number)],
    ["Status", formatRoomBookingValue(booking.status)],
    ["Booking Source", formatRoomBookingValue(booking.booking_source)],
    ["Created At", formatRoomBookingDateTime(booking.created_at)],
  ]);

  addSection("Booking Details", [
    ["Room Type", booking.room_type?.name || "-"],
    ["Room Number", booking.room?.room_number || "-"],
    ["Room Status", booking.room?.status || "-"],
    ["Check-in", formatRoomBookingDate(booking.checked_in)],
    ["Check-out", formatRoomBookingDate(booking.checked_out)],
    ["Guests", formatBookingGuestSummary(booking)],
    ["Nights", String(getNights(booking.checked_in, booking.checked_out) || 0)],
  ]);

  addSection("Additional Details", [
    ["Room Description", formatRoomBookingValue(booking.room_type?.description)],
  ]);

  if (booking.special_requests?.length) {
    const rows = booking.special_requests.map((req: any) => {
      const qty = Number(req.quantity || 0);
      const price = Number(req.price || 0) * qty;
      return [req.name || "-", String(qty), formatRoomBookingMoneyForPdf(price)] as [
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
      formatRoomBookingMoneyForPdf(calculateBookingPrice(booking)),
    ],
    ["Total Add-ons", formatRoomBookingMoneyForPdf(Number(booking.total_add_ons))],
    ["Total Amount", formatRoomBookingMoneyForPdf(totalAmount)],
    ["Amount Paid", formatRoomBookingMoneyForPdf(Number(booking.amount_paid) || 0)],
    ["Balance Due", formatRoomBookingMoneyForPdf(balanceDue)],
  ]);

  doc.save(`room-booking-${booking.booking_number}.pdf`);
}
