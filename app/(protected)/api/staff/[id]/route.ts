import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

//GET ONE
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: staff, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching staff:", error.message);
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
        title: "success",
        description: "",
        color: "success",
      },
      data: staff,
    },
    { status: 201 },
  );
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("staff")
    .update(body)
    .eq("id", id)
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
          description: "Staff not found",
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
      description: "Staff updated successfully",
      color: "success",
    },
    data: data,
  });
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase.from("staff").delete().eq("id", id);

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
        description: "Item deleted successfully",
        color: "success",
      },
    },
    { status: 200 },
  );
}
