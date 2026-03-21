import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteFeedbackById,
  updateFeedbackById,
} from "@/services/api/feedback-item";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateFeedbackById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Guest feedback updated successfully", "success"),
    );
  } catch (error) {
    console.error("Update error:", error);
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    await deleteFeedbackById(id);

    return apiSuccess(
      null,
      apiMessage("Success", "Guest feedback deleted successfully", "success"),
      200,
    );
  } catch (error) {
    console.error("Delete error:", error);
    return apiErrorResponse(error);
  }
}
