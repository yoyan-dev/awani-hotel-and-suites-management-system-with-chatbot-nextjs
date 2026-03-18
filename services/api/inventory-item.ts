import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

export async function updateInventoryItemById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("inventory")
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

export async function deleteInventoryItemById(id: string) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
