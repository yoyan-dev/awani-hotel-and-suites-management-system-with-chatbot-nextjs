import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "IMAGES", uid: "images" },
  { name: "NAME", uid: "name" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "ADD ONS", uid: "room_type_add_ons" },
  { name: "ROOM SIZE", uid: "room_size" },
  { name: "PRICE", uid: "price" },
  { name: "PEAK SEASON", uid: "peak_season_price" },
  { name: "ACTIONS", uid: "actions" },
];

export const INITIAL_VISIBLE_COLUMNS = [
  "images",
  "name",
  "description",
  "room_type_add_ons",
  "room_size",
  "price",
  "peak_season_price",
  "actions",
];
