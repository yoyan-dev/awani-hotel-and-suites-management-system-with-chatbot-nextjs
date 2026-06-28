import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "#", uid: "id" },
  { name: "Guest Name", uid: "full_name" },
  { name: "Email Address", uid: "email" },
  { name: "Room Type", uid: "room_type" },
  { name: "Room No.", uid: "room_number" },
  { name: "Check-In", uid: "check_in" },
  { name: "Check-Out", uid: "check_out" },
  { name: "Rating", uid: "rating" },
  { name: "Guest Feedback", uid: "comments" },
  { name: "Recommendation", uid: "recommend" },
  { name: "Approval", uid: "is_approved" },
  { name: "Actions", uid: "actions" },
];

export const recommendationOptions = [
  { name: "Recommended", uid: "yes" },
  { name: "Not Recommended", uid: "no" },
];

export const recommendationColorMap: Record<
  (typeof recommendationOptions)[number]["uid"],
  "success" | "danger"
> = {
  yes: "success",
  no: "danger",
};

export const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "full_name",
  "room_type",
  "room_number",
  "rating",
  "comments",
  "recommend",
  "is_approved",
  "actions",
];
