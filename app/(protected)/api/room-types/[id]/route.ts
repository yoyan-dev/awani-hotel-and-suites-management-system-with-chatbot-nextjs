import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteRoomTypeById,
  getRoomTypeById,
  updateRoomTypeById,
} from "@/services/api/room-types";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await getRoomTypeById(id);

    return apiSuccess(data, apiMessage("Success", "", "success"));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateRoomTypeById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Room types updated successfully", "success"),
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
    const data = await deleteRoomTypeById(id);

    return apiSuccess(
      data,
      apiMessage("Success", "Room types deleted successfully", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
