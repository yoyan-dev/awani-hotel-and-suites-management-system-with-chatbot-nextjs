import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

export async function getRoomStatusAnalytics() {
  const { data, error } = await supabase.from("rooms").select("status");

  if (error) {
    throw new ApiRouteError(error.message);
  }

  const statusCounts = (data ?? []).reduce(
    (acc, room) => {
      const status = room.status;
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));
}
