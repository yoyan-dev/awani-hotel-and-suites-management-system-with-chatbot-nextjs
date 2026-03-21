import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteUserById,
  getUserRecordById,
  updateUserById,
} from "@/services/api/users-item";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await getUserRecordById(id);

    return apiSuccess(data, apiMessage("success", "", "success"), 200);
  } catch (error) {
    console.error("Error fetching user:", error);
    return apiErrorResponse(error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateUserById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Account updated successfully", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await deleteUserById(id);

    return apiSuccess(
      data,
      apiMessage("Success", "Account deleted successfully", "success"),
      200,
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}
