import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listAuthLogs } from "@/services/api/auth-log-list";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = 10;
    const result = await listAuthLogs({
      page,
      limit,
      userId: searchParams.get("userId"),
      query: (searchParams.get("q") ?? "").trim(),
    });

    return apiSuccess(result.data, apiMessage("Success", "", "success"), 200, {
      pagination: result.pagination,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
