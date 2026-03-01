import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

const tableName = "room-reports";

//GET ALL
export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const roomNumber = searchParams.get("roomNumber") || "";
  const guestName = searchParams.get("guestName") || "";
  const reportType = searchParams.get("reportType") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1") || 1;
  const limit = 10;
  const from = (page - 1) * limit || 0;
  const to = from + limit - 1 || 0;

  let q = supabase.from(tableName).select(`*`, { count: "exact" });

  if (query) {
    q = q.or(`
    room_number.ilike.%${query}%,
    guest_name.ilike.%${query}%,
    item_name.ilike.%${query}%,
    item_category.ilike.%${query}%,
    damage_type.ilike.%${query}%,
    status.ilike.%${query}%,
    reported_by.ilike.%${query}%,
  `);
  }

  if (roomNumber) q = q.eq("room_number", roomNumber);
  if (guestName) q = q.eq("guest_name", guestName);
  if (reportType) q = q.eq("report_type", reportType);
  if (status) q = q.eq("status", status);

  const {
    data: roomReports,
    error,
    count,
  } = await q.range(from, to).order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching room reports:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  console.log("Room reports data:", roomReports);
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: roomReports || [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 201 },
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();

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
      quantity: formData.get("quantity")
        ? Number(formData.get("quantity"))
        : null,
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

    const { data, error } = await supabase
      .from(tableName)
      .insert(roomReport)
      .select();

    console.log("data", formData);
    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Room report already exists.",
              color: "danger",
            },
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Report added successfully",
          color: "success",
        },
        data: data[0],
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

//DELETE MANY
export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from(tableName).delete();

    if (selectedValues === "all") {
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues.map(String));
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: selectedValues,
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete room reports",
            color: "error",
          },
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description:
          selectedValues === "all"
            ? "All room reports deleted successfully"
            : "Selected room reports deleted successfully",
        color: "success",
      },
      data: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Something went wrong",
          color: "error",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
