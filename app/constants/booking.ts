import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  // --- Booking Details ---
  { name: "BOOKING #", uid: "booking_number" },

  // --- Guest Info ---
  { name: "GUEST NAME", uid: "guest_name" },
  { name: "NUMBER OF GUESTS", uid: "number_of_guests" },
  { name: "RECENT SICKNESS", uid: "recent_sickness" },

  // --- Room Info ---
  { name: "ROOM", uid: "room" },
  { name: "ROOM TYPE", uid: "room_type" },

  // --- Stay Info ---
  { name: "NIGHTS", uid: "nights" },
  { name: "CHECK IN / OUT", uid: "check_in_out" },
  { name: "ARRIVAL", uid: "check_in" },
  { name: "DEPARTURE", uid: "check_out" },

  // --- Additional Info ---
  { name: "COMPANY", uid: "company" },
  { name: "PLACED LAST VISITED", uid: "places_last_visited" },
  { name: "PURPOSE OF STAY", uid: "purpose" },
  { name: "REQUEST MESSAGE", uid: "request_messages" },

  // --- Payment Info ---
  { name: "PAYMENT METHOD", uid: "payment_method" },
  { name: "BOOKING SOURCE", uid: "booking_source" },
  { name: "AMOUNT PAID", uid: "amount_paid" },
  { name: "TOTAL PRICE", uid: "total_price" },
  { name: "PAYMENT STATUS", uid: "payment_status" },

  // --- Status ---
  { name: "STATUS", uid: "status", sortable: true },

  // --- Actions ---
  { name: "ACTIONS", uid: "actions" },
];

export const bookingStatusOptions = [
  { name: "Confirmed", uid: "confirmed" },
  { name: "Cancelled", uid: "cancelled" },
  { name: "Pending", uid: "pending" },
  { name: "Processing", uid: "processing" },
  { name: "Reserved", uid: "reserved" },
  { name: "Deposit", uid: "deposit" },
  { name: "Paid", uid: "paid" },
  { name: "Checked In", uid: "check_in" },
  { name: "Checked Out", uid: "check_out" },
];

export const bookingStatusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  "check-in": "bg-green-100 text-green-800",
  "check-out": "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
};

export const bookingStatusHexColorMap: Record<string, string> = {
  pending: "#facc15", // yellow
  reserved: "#a78bfa", // purple
  confirmed: "#60a5fa", // blue
  "check-in": "#34d399", // green
  cancelled: "#f87171", // red
  default: "#9ca3af", // gray
};

export const INITIAL_VISIBLE_COLUMNS = [
  "booking_number",
  "room",
  "guest_name",
  "room_type",
  "nights",
  "total_price",
  "status",
  "actions",
];

export const VISIBLE_COLUMNS = [
  "booking_number",
  "room",
  "guest_name",
  "room_type",
  "nights",
  "company",
  "total_price",
  "number_of_guests",
  "request_messages",
  "payment_status",
  "payment_method",
  "booking_source",
  "amount_paid",
  "status",
  "actions",
];

export const INITIAL_HOUSEKEEPING_VISIBLE_COLUMNS = [
  "room",
  "guest_name",
  "nights",
  "check_in",
  "check_out",
];
