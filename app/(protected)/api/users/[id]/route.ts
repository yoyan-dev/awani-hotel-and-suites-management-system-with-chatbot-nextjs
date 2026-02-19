import { NextRequest, NextResponse } from "next/server";
import type { User } from "@/types/users";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { supabaseAdmin } from "@/lib/supabase/admin";

//Get [id]
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
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
      data: user,
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

  const result = await supabaseAdmin.auth.admin.updateUserById(id, body);

  console.log(result);
  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Account updated successfully",
      color: "success",
    },
    data: [],
  });
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;

    // Delete user from Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: `DB Error: ${error.message}`,
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
          description: "Account deleted successfully",
          color: "success",
        },
        data: data,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: `Api Error: ${err.message}`,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
