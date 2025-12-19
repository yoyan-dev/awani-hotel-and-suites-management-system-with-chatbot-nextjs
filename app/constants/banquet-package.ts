import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "MENUS", uid: "menus" },
  { name: "PRICE", uid: "price" },
  { name: "ACTIONS", uid: "actions" },
];

export const menuCategory = [
  { name: "Appetizer", uid: "appetizer" },
  { name: "Salad", uid: "salad" },
  { name: "Soup", uid: "soup" },
  { name: "Vegetables", uid: "vegetables" },
  { name: "Seafood", uid: "seafood" },
  { name: "Beef", uid: "beef" },
  { name: "Dessert", uid: "dessert" },
  { name: "Pork", uid: "pork" },
  { name: "Poultry", uid: "poultry" },
  { name: "Pasta and Noodles", uid: "pasta_and_noodles" },
  { name: "Carving", uid: "carving" },
  { name: "Beaverage", uid: "beaverage" },
  { name: "Kid's Menu", uid: "kids_menu" },
  { name: "Drinks", uid: "drinks" },
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
  "id",
  "name",
  "menus",
  "price",
  "actions",
];
