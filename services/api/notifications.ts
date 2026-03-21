import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

const tableName = "notifications";

export async function listNotifications(page: number, limit: number) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await supabase
    .from(tableName)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
  };
}

export async function createNotification(body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([{ ...body, is_read: false }])
    .select();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function deleteAllNotifications() {
  const { data, error } = await supabase.from(tableName).delete();

  if (error) {
    throw new ApiRouteError("Failed to delete notifications", {
      extra: { error: error.message },
    });
  }

  return data;
}

export async function updateNotificationById(
  id: number,
  body: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from(tableName)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      color: "error",
      extra: { error: error.message },
    });
  }

  if (!data) {
    throw new ApiRouteError("Notification not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteNotificationById(id: number) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}

export async function getNotificationsMeta() {
  const { count, error: countError } = await supabase
    .from(tableName)
    .select("id", { count: "exact", head: true })
    .neq("id", 0);

  if (countError) {
    throw new ApiRouteError(countError.message);
  }

  const { data: latest, error: latestError } = await supabase
    .from(tableName)
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    throw new ApiRouteError(latestError.message);
  }

  return {
    unreadCount: count ?? 0,
    latestCreatedAt: latest?.created_at ?? "",
  };
}
