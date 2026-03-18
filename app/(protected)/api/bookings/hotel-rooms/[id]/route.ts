import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  deleteHotelBookingById,
  getHotelBookingById,
  updateHotelBookingById,
} from "@/services/api/bookings/hotel-bookings";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await getHotelBookingById(id);

    return apiSuccess(data, apiMessage("success", "", "success"), 201);
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
    const data = await updateHotelBookingById(
      id,
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Booking updated successfully", "success"),
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
    await deleteHotelBookingById(id);

    return apiSuccess(
      null,
      apiMessage("Success", "Item deleted successfully", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
