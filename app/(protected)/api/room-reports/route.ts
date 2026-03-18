import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createRoomReport,
  deleteRoomReports,
  listRoomReports,
} from "@/services/api/room-reports";
import { ApiResponse } from "@/types/response";
import {
  apiBulkDeleteSuccess,
  apiMessage,
  apiSuccess,
} from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1") || 1;
    const limit = 10;
    const result = await listRoomReports({
      query: searchParams.get("q") || "",
      roomNumber: searchParams.get("roomNumber") || "",
      guestName: searchParams.get("guestName") || "",
      reportType: searchParams.get("reportType") || "",
      status: searchParams.get("status") || "",
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("success", "", "success"), 201, {
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching room reports:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createRoomReport(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Report added successfully", "success"),
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
    const data = await deleteRoomReports(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
