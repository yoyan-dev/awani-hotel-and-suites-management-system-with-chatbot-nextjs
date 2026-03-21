import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

type ListHousekeepingParams = {
  query?: string;
  status?: string;
  page: number;
  limit: number;
};

export async function listHousekeepingTasks({
  query = "",
  status = "",
  page,
  limit,
}: ListHousekeepingParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase
    .from("housekeeping" as any)
    .select("*", { count: "exact" });

  if (query) {
    request = request.or(`
      message.ilike.%${query}%,
      guest_name.ilike.%${query}%,
      task_type.ilike.%${query}%
    `);
  }

  if (status) {
    request = request.eq("status", status);
  }

  const { data, error, count } = await request
    .order("scheduled_time", { ascending: false })
    .range(from, to);

  if (error) {
    throw new ApiRouteError(error.message);
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

export async function createHousekeepingTask(body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("housekeeping" as any)
    .insert(body)
    .select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Housekeeping task already exists.", {
        status: 400,
      });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function deleteHousekeepingTasks(selectedValues: number[] | "all") {
  let request = supabase.from("housekeeping" as any).delete();

  if (selectedValues === "all") {
  } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    request = request.in("id", selectedValues.map(String));
  } else {
    throw new ApiRouteError(String(selectedValues), {
      status: 400,
      color: "warning",
    });
  }

  const { data, error } = await request;

  if (error) {
    throw new ApiRouteError("Failed to delete items.", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}

export async function updateHousekeepingTaskById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("housekeeping" as any)
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
    throw new ApiRouteError("Item not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteHousekeepingTaskById(id: string) {
  const { error } = await supabase
    .from("housekeeping" as any)
    .delete()
    .eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
