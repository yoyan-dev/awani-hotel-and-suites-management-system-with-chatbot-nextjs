import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listAvailableFunctionRooms } from "@/services/api/availability";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const data = await listAvailableFunctionRooms({
      status: searchParams.get("status") || "",
      start: searchParams.get("start") || "",
      end: searchParams.get("end") || "",
    });

    return apiSuccess(data, apiMessage("Success", "", "success"), 200);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
