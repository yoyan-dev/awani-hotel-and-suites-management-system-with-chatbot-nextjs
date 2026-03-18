import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteRoomById,
  getRoomById,
  updateRoomById,
} from "@/services/api/rooms";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await getRoomById(id);

    return apiSuccess(data, apiMessage("success", "", "success"), 201);
  } catch (error) {
    console.error("Error fetching room:", error);
    return apiErrorResponse(error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateRoomById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Room updated successfully", "success"),
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
    await deleteRoomById(id);

    return apiSuccess(
      null,
      apiMessage("Success", "Room deleted successfully", "success"),
    );
  } catch (error) {
    console.error("Delete error:", error);
    return apiErrorResponse(error);
  }
}
