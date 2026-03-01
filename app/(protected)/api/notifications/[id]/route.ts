import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

// UPDATE notification
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const notificationId = Number(id);
  if (!Number.isFinite(notificationId)) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Invalid notification id",
          color: "error",
        },
      },
      { status: 400 },
    );
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("notifications")
    .update(body)
    .eq("id", notificationId)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
        error: error.message,
      },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Notification not found",
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Notification updated successfully",
      color: "success",
    },
    data: data,
  });
}

// DELETE notification
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const notificationId = Number(id);
  if (!Number.isFinite(notificationId)) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Invalid notification id",
          color: "error",
        },
      },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Notification deleted successfully",
        color: "success",
      },
    },
    { status: 200 },
  );
}
