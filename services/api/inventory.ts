import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

export async function listInventoryItems() {
  const { data, error } = await supabase.from("inventory").select("*");

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data ?? [];
}

export async function createInventoryItem(formData: FormData) {
  const newData = { ...Object.fromEntries(formData.entries()) };
  const { data, error } = await supabase
    .from("inventory")
    .insert([newData])
    .select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Item already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function deleteInventoryItems(selectedValues: number[] | "all") {
  let request = supabase.from("inventory").delete();

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
