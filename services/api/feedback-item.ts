import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

const dbTable = "feedback";

export async function updateFeedbackById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from(dbTable)
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
    throw new ApiRouteError("Guest Feedback not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteFeedbackById(id: string) {
  const { error } = await supabase.from(dbTable).delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
