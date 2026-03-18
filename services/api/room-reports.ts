import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";

const tableName = "room-reports";

type ListRoomReportsParams = {
  query?: string;
  roomNumber?: string;
  guestName?: string;
  reportType?: string;
  status?: string;
  page: number;
  limit: number;
};

export async function listRoomReports({
  query = "",
  roomNumber = "",
  guestName = "",
  reportType = "",
  status = "",
  page,
  limit,
}: ListRoomReportsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase.from(tableName).select(`*`, { count: "exact" });

  if (query) {
    request = request.or(`
      room_number.ilike.%${query}%,
      guest_name.ilike.%${query}%,
      item_name.ilike.%${query}%,
      item_category.ilike.%${query}%,
      damage_type.ilike.%${query}%,
      status.ilike.%${query}%,
      reported_by.ilike.%${query}%,
    `);
  }

  if (roomNumber) request = request.eq("room_number", roomNumber);
  if (guestName) request = request.eq("guest_name", guestName);
  if (reportType) request = request.eq("report_type", reportType);
  if (status) request = request.eq("status", status);

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

export async function createRoomReport(formData: FormData) {
  const roomReport = {
    room_number: formData.get("room_number")
      ? String(formData.get("room_number"))
      : null,
    guest_name: formData.get("guest_name")
      ? String(formData.get("guest_name"))
      : null,
    report_type: formData.get("report_type")
      ? String(formData.get("report_type"))
      : null,
    item_name: formData.get("item_name")
      ? String(formData.get("item_name"))
      : null,
    item_category: formData.get("item_category")
      ? String(formData.get("item_category"))
      : null,
    quantity: formData.get("quantity") ? Number(formData.get("quantity")) : null,
    damage_type: formData.get("damage_type")
      ? String(formData.get("damage_type"))
      : null,
    reported_by: formData.get("reported_by")
      ? String(formData.get("reported_by"))
      : null,
    resolved_date: null,
    status: "pending",
    notes: formData.get("notes") ? String(formData.get("notes")) : null,
  };

  const { data, error } = await supabase.from(tableName).insert(roomReport).select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Room report already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function deleteRoomReports(selectedValues: number[] | "all") {
  let request = supabase.from(tableName).delete();

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
    throw new ApiRouteError("Failed to delete room reports", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}

export async function getRoomReportById(id: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select(`*`)
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateRoomReportById(
  id: string,
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
    throw new ApiRouteError("Room report not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteRoomReportById(id: string) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
