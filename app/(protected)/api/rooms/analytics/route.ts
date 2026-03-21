import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { getRoomStatusAnalytics } from "@/services/api/rooms-analytics";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await getRoomStatusAnalytics();
    return apiSuccess(data, apiMessage("success", "", "success"), 200);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse(error);
  }
}
