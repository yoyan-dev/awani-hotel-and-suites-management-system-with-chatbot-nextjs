import { supabase } from "@/lib/supabase/supabase-client";

export async function GenerateBookingNumber(payload: string) {
  let bookingNumber = 1;

  // Fetch current count
  const { data, error: selectError } = await supabase
    .from("booking_count")
    .select("id, count")
    .eq("type", payload)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    return null;
  }
  if (data) {
    bookingNumber = data.count + 1;

    await supabase
      .from("booking_count")
      .update({ count: bookingNumber })
      .eq("type", payload)
      .eq("id", data.id);
  } else {
    await supabase
      .from("booking_count")
      .insert({ count: bookingNumber, type: payload });
  }

  // Format: BN#0000
  const formattedBookingNumber = `BN#${String(bookingNumber).padStart(4, "0")}`;

  return formattedBookingNumber;
}
