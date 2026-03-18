import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { getNotificationsMeta } from "@/services/api/notifications";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await getNotificationsMeta();
    return apiSuccess(data, apiMessage("Success", "", "success"), 200);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
