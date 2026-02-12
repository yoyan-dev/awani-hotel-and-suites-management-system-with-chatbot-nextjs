import { NextResponse } from "next/server";

import { ApiResponse } from "@/types/response";
import { createClient } from "@/lib/supabase/server";

/**
 * GET current logged-in user
 */
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

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
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Fetched current user",
        color: "success",
      },
      data: user,
    },
    { status: 200 }
  );
}

/**
 * CREATE user account
 */
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  const supabase = await createClient();
  try {
    const { email, password, ...metadata } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // profile metadata
      },
    });

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Account created successfully.",
          color: "success",
        },
        data,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * UPDATE current user (email / password / metadata)
 */
export async function PUT(req: Request): Promise<NextResponse<ApiResponse>> {
  const supabase = await createClient();
  try {
    const body = await req.json();

    const { data, error } = await supabase.auth.updateUser(body);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Account updated successfully.",
          color: "success",
        },
        data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE current user session (sign out)
 *
 * Note: supabase client-side lang ang may signOut().
 * Kung admin-level delete user account, dapat Supabase Admin API key ang gamit mo.
 */
export async function DELETE(): Promise<NextResponse<ApiResponse>> {
  const supabase = await createClient();
  try {
    // Sign out current session
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description: "Signed out successfully.",
        color: "success",
      },
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
      },
      { status: 500 }
    );
  }
}
