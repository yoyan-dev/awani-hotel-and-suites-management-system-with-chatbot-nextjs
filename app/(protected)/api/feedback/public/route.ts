import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { listFeedback } from "@/services/api/feedback";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = 10;
    const result = await listFeedback({
      query: searchParams.get("q") || "",
      rating: searchParams.get("rating") || "0",
      approval: "approved",
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("success", "", "success"), 200, {
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching public guest feedback:", error);
    return apiErrorResponse(error);
  }
}
