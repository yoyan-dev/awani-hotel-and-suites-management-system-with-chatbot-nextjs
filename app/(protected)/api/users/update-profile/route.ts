import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/response";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const {
      user,
      email,
      current_password,
      new_password,
      confirm_password,
      user_metadata,
    } = body;

    // ============================
    // PASSWORD CHANGE
    // ============================
    if (new_password) {
      if (!current_password) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Current password is required",
              color: "error",
            },
          },
          { status: 400 },
        );
      }

      if (new_password !== confirm_password) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Password Mismatch",
              description: "New password and confirm password do not match",
              color: "error",
            },
          },
          { status: 400 },
        );
      }

      if (current_password === new_password) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Invalid Password",
              description: "New password cannot be the same as old password",
              color: "warning",
            },
          },
          { status: 400 },
        );
      }

      // Re-authenticate
      const { error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({
          email: user.email!,
          password: current_password,
        });

      if (signInError) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Incorrect Password",
              description: "Current password is incorrect",
              color: "error",
            },
          },
          { status: 400 },
        );
      }
    }

    const updatePayload: any = {};

    if (email) updatePayload.email = email;
    if (user_metadata) updatePayload.user_metadata = user_metadata;
    if (new_password) updatePayload.password = new_password;

    const result = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      updatePayload,
    );

    console.log(result);

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description: new_password
          ? "Account and password updated successfully"
          : "Account updated successfully",
        color: "success",
      },
    });
  } catch (error: any) {
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
}
