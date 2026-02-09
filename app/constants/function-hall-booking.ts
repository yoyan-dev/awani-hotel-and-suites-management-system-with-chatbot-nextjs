import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "EVENT TYPE", uid: "event_type" },
  { name: "EVENT DATE", uid: "event_date" },
  { name: "DURATION", uid: "event_duration" },
  { name: "GUEST NAME", uid: "guest" },
  { name: "NO. OF GUESTS", uid: "number_of_guest" },
  { name: "BANQUET PACKAGE", uid: "banquet_package" },
  { name: "ROOM", uid: "room" },
  { name: "OCCUPANCY", uid: "occupancy_type" },
  { name: "NOTES", uid: "notes" },
  { name: "STATUS", uid: "status", sortable: true },
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
];

export const bookingStatusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
};

export const bookingStatusHexColorMap: Record<string, string> = {
  pending: "#facc15", // yellow
  reserved: "#a78bfa", // purple
  confirmed: "#60a5fa", // blue
  checked_in: "#34d399", // green
  cancelled: "#f87171", // red
  default: "#9ca3af", // gray
};

export const INITIAL_VISIBLE_COLUMNS = [
  "event_type",
  "event_date",
  "event_duration",
  "number_of_guest",
  "banquet_package",
  "room",
  "occupancy_type",
  "notes",
  "status",
  "guest",
  "actions",
];

export const VISIBLE_COLUMNS = [
  "event_type",
  "event_date",
  "event_duration",
  "number_of_guest",
  "banquet_package",
  "room",
  "occupancy_type",
  "notes",
  "status",
  "guest",
  "actions",
];

export const INITIAL_HOUSEKEEPING_VISIBLE_COLUMNS = [
  "room",
  "guest",
  "event_date",
  "event_duration",
  "status",
];
