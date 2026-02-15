import { NextResponse } from "next/server";
import type { Room } from "@/types/room";
import { supabase } from "@/lib/supabase-client";
import { uploadRoomImage } from "@/lib/upload-room-image";
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
      room_number: formData.get("room_number"),
      guest_name: formData.get("guest_name"),
      report_type: formData.get("report_type"),
      item_name: formData.get("item_name"),
      item_category: formData.get("item_category"),
      quantity: formData.get("quantity"),
      damage_type: formData.get("damage_type"),
      reported_by: formData.get("reported_by"),
      resolved_date: null,
      status: "pending",
      notes: formData.get("notes"),
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert([roomReport])
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
      query = query.in("id", selectedValues);
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
