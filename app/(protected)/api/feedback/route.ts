import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createFeedback,
  deleteFeedback,
  listFeedback,
} from "@/services/api/feedback";
import { ApiResponse } from "@/types/response";
import {
  apiBulkDeleteSuccess,
  apiMessage,
  apiSuccess,
} from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = 10;
    const result = await listFeedback({
      query: searchParams.get("q") || "",
      rating: searchParams.get("rating") || "0",
      approval: searchParams.get("approval") || "all",
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("success", "", "success"), 201, {
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching guest feedback:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createFeedback(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Feedback successfully submitted.", "success"),
      201,
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues = body.selectedValues as number[] | "all";
    const data = await deleteFeedback(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
