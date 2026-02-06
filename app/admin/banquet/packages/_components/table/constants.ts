import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "MENUS", uid: "menus" },
  { name: "PRICE", uid: "price" },
  { name: "STATUS", uid: "is_active" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "in-stock", uid: "in-stock" },
  { name: "out-of-stock", uid: "out-of-stock" },
  { name: "discontinued", uid: "discontinued" },
];

export const statusColorMap: Record<
  (typeof statusOptions)[number]["uid"],
  "success" | "danger" | "warning"
> = {
  "in-stock": "success",
  "out-of-stock": "danger",
  discontinued: "warning",
};

export const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "menus",
  "price",
  "status",
  "actions",
];
