import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listAvailableRoomTypes } from "@/services/api/availability";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const data = await listAvailableRoomTypes({
      checkIn: searchParams.get("checkIn"),
      checkOut: searchParams.get("checkOut"),
      maxGuest: Number(searchParams.get("maxGuest") || 1),
    });

    return apiSuccess(
      data,
      apiMessage("Success", "Available room types fetched", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
