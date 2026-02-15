import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";

const tableName = "notifications";

// GET all notifications
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error.message);
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
        description: "",
        color: "success",
      },
      data,
    },
    { status: 200 },
  );
}

// POST a new notification
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const newNotif = { ...body, is_read: false };

    const { data, error } = await supabase
      .from(tableName)
      .insert([newNotif])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
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
          description: "Notification added successfully",
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

// DELETE notifications (selected or all)
export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    let query = supabase.from(tableName).delete();
    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete notifications",
            color: "danger",
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
        description: "All notifications deleted successfully",
        color: "success",
      },
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
