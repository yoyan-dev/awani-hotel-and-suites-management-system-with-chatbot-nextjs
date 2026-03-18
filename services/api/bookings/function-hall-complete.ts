import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

export async function completeFunctionHallBookingById(bookingId: string) {
  if (!bookingId) {
    throw new ApiRouteError("Booking id is required.", {
      status: 400,
      title: "Invalid Data",
      color: "warning",
    });
  }

  const { data, error } = await supabase
    .from("function_hall_bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}
