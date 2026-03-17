import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { FunctionHallBooking } from "@/types/function-room-booking";
import {
  parseBookingBoundaryDateOnly,
  parseBookingBoundaryDateTime,
  parseISODateTime,
  parseISODateOnly,
} from "@/utils/function-room/event-duration-date";
import { sendEmail } from "@/lib/email/emailjs";
import { buildFunctionRoomReceiptEmail } from "@/lib/email/receipt-templates";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.trim() || "";
  const guest_id = searchParams.get("guest_id") || "";
  const status = searchParams.get("status") || "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const hasDateRangeFilter = Boolean(start && end);

  const sanitizeBooking = (booking: any) => {
    const { room_id, ...rest } = booking ?? {};
    return rest;
  };

  let q = supabase
    .from("function_hall_bookings")
    .select(
      `
      *,
      guest: guest_id(*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (guest_id) q = q.eq("guest_id", guest_id);
  if (status) q = q.eq("status", status);
  if (query) {
    q = q.or(
      `booking_number.ilike.%${query}%,event_type.ilike.%${query}%,notes.ilike.%${query}%`,
    );
  }

  if (!hasDateRangeFilter) {
    q = q.range(from, to);
  }

  const { data, error, count } = await q;

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  if (hasDateRangeFilter && start && end) {
    const filterStartDate = parseISODateOnly(start);
    const filterEndDate = parseISODateOnly(end);
    if (!filterStartDate || !filterEndDate) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Date Filter",
            description: "Invalid start or end date filter.",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const filtered =
      (data ?? []).filter((booking) => {
        const bookingStart = parseBookingBoundaryDateOnly(booking, "start");
        const bookingEnd =
          parseBookingBoundaryDateOnly(booking, "end") || bookingStart;

        if (!bookingStart || !bookingEnd) {
          return false;
        }

        return bookingStart >= filterStartDate && bookingEnd <= filterEndDate;
      }) ?? [];

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "",
          color: "success",
        },
        data: filtered.slice(from, to + 1).map(sanitizeBooking),
        pagination: {
          page,
          limit,
          total: filtered.length,
          total_pages: Math.ceil(filtered.length / limit),
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "",
        color: "success",
      },
      data: (data ?? []).map(sanitizeBooking),
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 200 },
  );
}

/*CREATE */

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const eventStart = formObj.event_start as string;
    const eventEnd = formObj.event_end as string;

    if (!eventStart || !eventEnd) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Event start and end are required",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const parsedStart = parseISODateTime(eventStart);
    const parsedEnd = parseISODateTime(eventEnd);
    if (!parsedStart || !parsedEnd || parsedStart >= parsedEnd) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Event range is invalid",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const bookingNumber = await GenerateBookingNumber("function-room");
    if (!bookingNumber) throw new Error("Failed to generate booking number");

    const bookingSource =
      formObj.booking_source === "walk-in" ? "walk-in" : "online";
    const bookingStatus =
      formObj.status === "confirmed" ? "confirmed" : "pending";

    const newBooking = {
      booking_number: bookingNumber,
      guest_id: formObj.guest_id as string,
      event_type: formObj.event_type as string,
      number_of_guest: Number(formObj.number_of_guest),
      event_start: eventStart,
      event_end: eventEnd,
      notes: formObj.notes as string,
      status: bookingStatus,
      booking_source: bookingSource,
    };

    if (!newBooking.guest_id || !newBooking.event_type) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Guest and event type are required",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(newBooking.number_of_guest) ||
      newBooking.number_of_guest <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Number of guest must be greater than zero",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    if (newBooking.guest_id) {
      const { data: existing, error: overlapError } = await supabase
        .from("function_hall_bookings")
        .select("id, event_start, event_end, status")
        .eq("guest_id", newBooking.guest_id)
        .not("status", "in", "(cancelled,completed)");

      if (overlapError) {
        throw overlapError;
      }

      const hasOverlap = existing?.some((b) => {
        const existingStart = parseBookingBoundaryDateTime(b as any, "start");
        const existingEnd =
          parseBookingBoundaryDateTime(b as any, "end") || existingStart;
        const newStart = parsedStart;
        const newEnd = parsedEnd;

        if (!existingStart || !existingEnd || !newStart || !newEnd) {
          return false;
        }

        return newStart < existingEnd && newEnd > existingStart;
      });

      if (hasOverlap) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Booking Conflict",
              description:
                "Guest already has an existing booking that overlaps this event schedule.",
              color: "warning",
            },
          },
          { status: 409 },
        );
      }
    }

    /* INSERT */

    const { data, error } = await supabase
      .from("function_hall_bookings")
      .insert([newBooking])
      .select()
      .single();

    if (error) throw error;

    const guestInfo = await supabase
      .from("guest")
      .select("full_name, email")
      .eq("id", newBooking.guest_id)
      .single();

    let emailWarning: string | null = null;

    if (guestInfo.error) {
      emailWarning = "Guest email could not be loaded.";
    } else if (!guestInfo.data?.email) {
      emailWarning = "Guest has no email address on file.";
    } else {
      try {
        const emailContent = buildFunctionRoomReceiptEmail({
          bookingNumber,
          guestName: guestInfo.data.full_name,
          eventType: newBooking.event_type,
          eventStart: eventStart,
          eventEnd: eventEnd,
          numberOfGuests: newBooking.number_of_guest,
          notes: newBooking.notes,
        });

        await sendEmail({
          to: guestInfo.data.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error("Failed to send function hall receipt:", emailError);
        emailWarning =
          emailError instanceof Error
            ? emailError.message
            : "Failed to send function hall receipt.";
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: emailWarning
          ? {
              title: "Booked With Email Warning",
              description: `Reservation successfully added, but the receipt email could not be sent: ${emailWarning}`,
              color: "warning",
            }
          : {
              title: "Success",
              description: "Reservation successfully added.",
              color: "success",
            },
        data,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

/* DELETE - BULK DELETE*/
export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("function_hall_bookings").delete();

    if (selectedValues === "all") {
      // delete all
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues.map(String));
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Request",
            description: "No items selected",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Items deleted successfully",
          color: "success",
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
