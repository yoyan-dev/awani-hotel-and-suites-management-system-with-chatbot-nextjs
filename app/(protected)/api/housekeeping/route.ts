import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createHousekeepingTask,
  deleteHousekeepingTasks,
  listHousekeepingTasks,
} from "@/services/api/housekeeping";
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
    const result = await listHousekeepingTasks({
      query: searchParams.get("q") || "",
      status: searchParams.get("status") || "",
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("success", "", "success"), 201, {
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching housekeeping tasks:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createHousekeepingTask(
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage(
        "Success",
        "Housekeeping tasks successfully added.",
        "success",
      ),
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
    const data = await deleteHousekeepingTasks(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
