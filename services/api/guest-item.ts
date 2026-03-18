import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

export async function getGuestById(id: string) {
  const { data, error } = await supabase
    .from("guest")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateGuestById(id: string, body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("guest")
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

export async function deleteGuestById(id: string) {
  const { error } = await supabase.from("guest").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
