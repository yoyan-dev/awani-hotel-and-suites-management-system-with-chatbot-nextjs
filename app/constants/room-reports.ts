import { ColumnType } from "@/types/column";

// Columns for Room Reports Table
export const columns: ColumnType[] = [
  { name: "REPORT ID", uid: "reportId" },
  { name: "ROOM NUMBER", uid: "room_number" },
  { name: "GUEST NAME", uid: "guest_name" },
  { name: "ITEM", uid: "item_name" },
  { name: "CATEGORY", uid: "item_category" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "DAMAGE TYPE", uid: "damage_type" },
  { name: "STATUS", uid: "status" },
  { name: "REPORTED BY", uid: "reported_by" },
  { name: "ACTIONS", uid: "actions" },
];

// Status options for reports
export const statusOptions = [
  { name: "pending", uid: "pending" },
  { name: "in progress", uid: "in_progress" },
  { name: "resolved", uid: "resolved" },
  { name: "returned", uid: "returned" },
];

// Status to color mapping
export const statusColorMap: Record<
  (typeof statusOptions)[number]["uid"],
  "success" | "danger" | "warning" | "info"
> = {
  pending: "warning",
  in_progress: "info",
  resolved: "success",
  returned: "danger",
};

// Columns visible by default
export const INITIAL_VISIBLE_COLUMNS = [
  "room_number",
  "guest_name",
  "item_name",
  "item_category",
  "quantity",
  "damage_type",
  "status",
  "reported_by",
  "actions",
];
