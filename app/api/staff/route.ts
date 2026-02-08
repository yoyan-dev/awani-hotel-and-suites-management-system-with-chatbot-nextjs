import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Staff } from "@/types/staff";
import { uploadUserImage } from "@/lib/upload-user-image";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const { data: guest, error } = await supabase.from("staff").select("*");

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

  console.log("Staff data:", guest);
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: guest || [],
    },
    { status: 201 },
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const image = formData.get("image") as File;
    const { email, phone, password, role, full_name, shift_type, position } =
      formObj;

    const imageUrl = image ? await uploadUserImage(image) : "";

    // create auth user
    const { data, error: AuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email as string,
        password: password as string,
        email_confirm: true,
        user_metadata: {},
        app_metadata: {
          full_name,
          image: imageUrl,
          role: (role as string) ?? "guest",
        },
      });

    if (AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: AuthError.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    const newStaff = {
      id: data.user.id,
      full_name: full_name as string,
      email: email as string,
      phone: phone as string,
      role: (role as string) || "guest",
      shift_type: shift_type || "N/A",
      position: position as string,
      image: imageUrl,
      status: "active",
    };

    const { data: staff, error } = await supabase
      .from("staff")
      .insert([newStaff])
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success!",
          description: "Account created successfully.",
          color: "success",
        },
        data: staff[0] || {},
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

//DELETE SELECTED
export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("staff").delete();

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
            description: "Failed to delete items.",
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
            ? "All items deleted successfully"
            : "Selected items deleted successfully",
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
          color: "error",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
