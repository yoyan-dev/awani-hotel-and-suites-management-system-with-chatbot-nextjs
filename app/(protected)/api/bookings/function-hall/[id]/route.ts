import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteFunctionHallBookingById,
  getFunctionHallBookingById,
  updateFunctionHallBookingById,
} from "@/services/api/bookings/function-hall-bookings";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await getFunctionHallBookingById(id);

    return apiSuccess(data, apiMessage("success", "", "success"), 200);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return apiErrorResponse(error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateFunctionHallBookingById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Booking updated successfully", "success"),
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
    await deleteFunctionHallBookingById(id);

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
