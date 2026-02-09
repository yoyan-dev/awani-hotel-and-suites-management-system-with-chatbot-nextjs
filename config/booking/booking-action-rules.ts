import { BookingActionRules } from "@/types/booking-action";

export const BOOKING_ACTIONS_BY_STATUS: BookingActionRules = {
  pending: ["view", "edit", "assign", "summary", "cancel"],

  confirmed: [
    "view",
    "assign",
    "checked_in",
    "extend",
    "summary",
    "add_payment",
    "cancel",
  ],

  reserved: ["view", "assign", "checked_in", "summary"],

  checked_in: ["view", "checked_out", "extend", "add_payment", "summary"],

  checked_out: ["view", "summary"],

  cancelled: ["view", "summary"],
};
