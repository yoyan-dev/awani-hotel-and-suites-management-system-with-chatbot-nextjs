import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "EVENT TYPE", uid: "event_type" },
  { name: "DURATION", uid: "event_start" },
  { name: "GUEST NAME", uid: "guest" },
  { name: "NO. OF GUESTS", uid: "number_of_guest" },
  { name: "ROOM", uid: "room" },
  { name: "OCCUPANCY", uid: "occupancy_type" },
  { name: "TOTAL AMOUNT", uid: "total_amount" },
  { name: "AMOUNT PAID", uid: "amount_paid" },
  { name: "BALANCE", uid: "balance" },
  { name: "PAYMENT STATUS", uid: "payment_status" },
  { name: "NOTES", uid: "notes" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const bookingStatusOptions = [
  { name: "Confirmed", uid: "confirmed" },
  { name: "Ongoing", uid: "ongoing" },
  { name: "Completed", uid: "completed" },
  { name: "Cancelled", uid: "cancelled" },
  { name: "Pending", uid: "pending" },
  { name: "Rejected", uid: "rejected" },
];

export const bookingStatusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  ongoing: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-rose-100 text-rose-800",
  default: "bg-gray-100 text-gray-700",
};

export const bookingStatusHexColorMap: Record<string, string> = {
  pending: "#facc15", // yellow
  reserved: "#a78bfa", // purple
  confirmed: "#60a5fa", // blue
  ongoing: "#f59e0b", // amber
  completed: "#34d399", // green
  cancelled: "#f87171", // red
  rejected: "#f43f5e", // rose
  default: "#9ca3af", // gray
};

export const INITIAL_VISIBLE_COLUMNS = [
  "event_type",
  "event_start",
  "number_of_guest",
  "room",
  "occupancy_type",
  "total_amount",
  "payment_status",
  "balance",
  "notes",
  "status",
  "guest",
  "actions",
];

export const VISIBLE_COLUMNS = [
  "event_type",
  "event_start",
  "number_of_guest",
  "room",
  "occupancy_type",
  "total_amount",
  "amount_paid",
  "balance",
  "payment_status",
  "notes",
  "status",
  "guest",
  "actions",
];

export const INITIAL_HOUSEKEEPING_VISIBLE_COLUMNS = [
  "room",
  "guest",
  "event_start",
  "status",
];
