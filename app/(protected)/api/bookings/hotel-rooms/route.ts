import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createHotelBooking,
  deleteHotelBookings,
  listHotelBookings,
} from "@/services/api/bookings/hotel-bookings";
import { ApiResponse } from "@/types/response";
import {
  apiBulkDeleteSuccess,
  apiMessage,
  apiSuccess,
} from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limitParam = searchParams.get("limit") || "10";
    const result = await listHotelBookings({
      roomTypeID: searchParams.get("roomTypeID"),
      guest_id: searchParams.get("guest_id"),
      status: searchParams.get("status"),
      start: searchParams.get("start"),
      end: searchParams.get("end"),
      page,
      limitParam,
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
    const result = await createHotelBooking(await req.formData());

    return apiSuccess(result.data, result.message, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues = body.selectedValues as number[] | "all";
    const data = await deleteHotelBookings(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
