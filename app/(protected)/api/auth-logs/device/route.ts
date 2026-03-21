import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { captureLoginDevice } from "@/services/api/auth-logs";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const result = await captureLoginDevice(
      req.headers,
      (await req.json()) as { userId?: string; deviceName?: string },
    );

    return apiSuccess(
      null,
      apiMessage("Success", result.description, "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
