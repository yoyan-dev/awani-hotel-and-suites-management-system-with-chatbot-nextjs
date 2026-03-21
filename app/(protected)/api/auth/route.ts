import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  getCurrentAuthUser,
  signOutCurrentAuthUser,
  signUpAuthUser,
  updateCurrentAuthUser,
} from "@/services/api/auth";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await getCurrentAuthUser();
    return apiSuccess(
      data,
      apiMessage("Success", "Fetched current user", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await signUpAuthUser((await req.json()) as Record<string, any>);
    return apiSuccess(
      data,
      apiMessage("Success", "Account created successfully.", "success"),
      201,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await updateCurrentAuthUser(
      (await req.json()) as Record<string, unknown>,
    );
    return apiSuccess(
      data,
      apiMessage("Success", "Account updated successfully.", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(): Promise<NextResponse<ApiResponse>> {
  try {
    await signOutCurrentAuthUser();
    return apiSuccess(
      null,
      apiMessage("Success", "Signed out successfully.", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
