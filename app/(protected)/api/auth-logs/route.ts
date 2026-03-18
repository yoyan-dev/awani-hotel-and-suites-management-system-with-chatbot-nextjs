import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listAuthLogs } from "@/services/api/auth-logs";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 20), 1), 100);
    const data = await listAuthLogs(
      page,
      limit,
      searchParams.get("userId"),
      (searchParams.get("q") ?? "").trim(),
    );

    return apiSuccess(data, apiMessage("Success", "", "success"), 200);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
