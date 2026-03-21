import { ApiRouteError } from "@/lib/api/route-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ListAuthLogsParams = {
  page: number;
  limit: number;
  userId?: string | null;
  query?: string;
};

export async function listAuthLogs({
  page,
  limit,
  userId,
  query = "",
}: ListAuthLogsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabaseAdmin
    .from("auth_activity_logs")
    .select("*", { count: "exact" })
    .order("event_at", { ascending: false })
    .range(from, to);

  if (userId) {
    request = request.eq("user_id", userId);
  }

  if (query) {
    const escaped = query.replace(/,/g, "");
    request = request.or(
      [
        `email.ilike.%${escaped}%`,
        `role.ilike.%${escaped}%`,
        `event_type.ilike.%${escaped}%`,
        `device_name.ilike.%${escaped}%`,
        `user_id.ilike.%${escaped}%`,
      ].join(","),
    );
  }

  const { data, error, count } = await request;

  if (error) {
    throw new ApiRouteError(error.message, { status: 400 });
  }

  return {
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  };
}
