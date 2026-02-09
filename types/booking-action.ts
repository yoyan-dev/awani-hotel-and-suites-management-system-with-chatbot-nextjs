import type { BookingStatus } from "@/types/booking";

export type BookingAction =
  | "view"
  | "edit"
  | "assign"
  | "checked_in"
  | "checked_out"
  | "extend"
  | "summary"
  | "add_payment"
  | "cancel";

export type BookingActionRules = Record<BookingStatus, BookingAction[]>;
