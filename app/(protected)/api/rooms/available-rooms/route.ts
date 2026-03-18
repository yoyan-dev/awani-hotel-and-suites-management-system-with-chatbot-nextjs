import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listAvailableRooms } from "@/services/api/availability";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const data = await listAvailableRooms({
      isStatusSelected: searchParams.get("isStatusSelected") || "",
      roomTypeID: searchParams.get("roomTypeId") || "",
      status: searchParams.get("status") || "",
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      roomId: searchParams.get("roomId") || "",
    });

    return apiSuccess(data, apiMessage("success", "", "success"), 200);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse(error);
  }
}
