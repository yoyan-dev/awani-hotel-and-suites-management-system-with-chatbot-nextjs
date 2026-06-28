import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

const dbTable = "feedback";

type ListFeedbackParams = {
  query?: string;
  rating?: string;
  approval?: string;
  page: number;
  limit: number;
};

export async function listFeedback({
  query = "",
  rating = "0",
  approval = "all",
  page,
  limit,
}: ListFeedbackParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase.from(dbTable).select(`*`, { count: "exact" });

  if (query) {
    request = request.or(
      `full_name.ilike.%${query}%,email.ilike.%${query}%,room_number.ilike.%${query}%,recommend.ilike.%${query}%,comments.ilike.%${query}%`,
    );
  }

  if (rating) {
    request = request.gte("rating", Number(rating));
  }

  if (approval === "approved") {
    request = request.eq("is_approved", true);
  }

  if (approval === "pending") {
    request = request.eq("is_approved", false);
  }

  const { data, error, count } = await request
    .range(from, to)
    .order("created_at", { ascending: false });

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

export async function createFeedback(formData: FormData) {
  const formObj = Object.fromEntries(formData.entries());
  const newData = {
    full_name: String(formObj.full_name ?? ""),
    email: String(formObj.email ?? ""),
    room_number: String(formObj.room_number ?? ""),
    check_in: String(formObj.check_in ?? ""),
    check_out: String(formObj.check_out ?? ""),
    comments: formObj.comments ? String(formObj.comments) : null,
    rating: Number(formObj.rating),
    recommend: String(formObj.recommend ?? ""),
  };

  const { data, error } = await supabase.from(dbTable).insert(newData).select();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function deleteFeedback(selectedValues: number[] | "all") {
  let request = supabase.from(dbTable).delete();

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
    throw new ApiRouteError("Failed to delete guest feedback.", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}
