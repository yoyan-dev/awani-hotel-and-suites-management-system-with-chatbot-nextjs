import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createFunctionHallBooking,
  deleteFunctionHallBookings,
  listFunctionHallBookings,
} from "@/services/api/bookings/function-hall-bookings";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = 10;
    const result = await listFunctionHallBookings({
      query: searchParams.get("query")?.trim() || "",
      guest_id: searchParams.get("guest_id") || "",
      status: searchParams.get("status") || "",
      start: searchParams.get("start"),
      end: searchParams.get("end"),
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("Success", "", "success"), 200, {
      pagination: result.pagination,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const result = await createFunctionHallBooking(await req.formData());

    return apiSuccess(result.data, result.message, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    await deleteFunctionHallBookings(body.selectedValues as number[] | "all");

    return apiSuccess(
      null,
      apiMessage("Success", "Items deleted successfully", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
