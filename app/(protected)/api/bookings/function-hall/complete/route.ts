import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { completeFunctionHallBookingById } from "@/services/api/bookings/function-hall-complete";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const data = await completeFunctionHallBookingById(String(body?.id ?? ""));

    return apiSuccess(
      data,
      apiMessage("Success", "Booking marked as completed.", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
