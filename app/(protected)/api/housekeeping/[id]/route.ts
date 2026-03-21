import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteHousekeepingTaskById,
  updateHousekeepingTaskById,
} from "@/services/api/housekeeping";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateHousekeepingTaskById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Housekeeping updated successfully", "success"),
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
    await deleteHousekeepingTaskById(id);

    return apiSuccess(
      null,
      apiMessage("Success", "Item deleted successfully", "success"),
      200,
    );
  } catch (error) {
    console.error("Delete error:", error);
    return apiErrorResponse(error);
  }
}
