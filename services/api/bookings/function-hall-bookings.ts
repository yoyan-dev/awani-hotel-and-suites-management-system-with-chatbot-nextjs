import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { ApiRouteError } from "@/lib/api/route-error";
import { buildFunctionRoomReceiptEmail, buildFunctionRoomBookingUpdateEmail } from "@/lib/email/receipt-templates";
import { sendEmail } from "@/lib/email/emailjs";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  parseBookingBoundaryDateOnly,
  parseBookingBoundaryDateTime,
  parseISODateOnly,
  parseISODateTime,
} from "@/utils/function-room/event-duration-date";

export const FUNCTION_HALL_BOOKING_DETAIL_SELECT = `
  id,
  booking_number,
  guest_id,
  event_type,
  event_start,
  event_end,
  number_of_guest,
  room_id,
  notes,
  occupancy_type,
  status,
  booking_source,
  payment_status,
  payment_method,
  amount_paid,
  total_amount,
  balance,
  created_at,
  guest: guest_id(*),
  room: room_id(*)
`;

type ListFunctionHallBookingsParams = {
  query?: string;
  guest_id?: string;
  status?: string;
  start?: string | null;
  end?: string | null;
  page: number;
  limit: number;
};

const sanitizeFunctionHallBooking = (booking: any) => {
  const { room_id, ...rest } = booking ?? {};
  return rest;
};

const toNumberOr = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolvePaymentStatus = (
  totalAmount: number,
  amountPaid: number,
): "pending" | "unpaid" | "deposit" | "paid" => {
  if (totalAmount <= 0) return "pending";
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= totalAmount) return "paid";
  return "deposit";
};

const buildFunctionHallUpdateIntro = () => {
  return "Your function hall reservation has been confirmed. Please review the latest summary below.";
};

function assertValidFunctionHallDateRange(eventStart: string, eventEnd: string) {
  if (!eventStart || !eventEnd) {
    throw new ApiRouteError("Event start and end are required", {
      status: 400,
      title: "Invalid Data",
      color: "warning",
    });
  }

  const parsedStart = parseISODateTime(eventStart);
  const parsedEnd = parseISODateTime(eventEnd);

  if (!parsedStart || !parsedEnd || parsedStart >= parsedEnd) {
    throw new ApiRouteError("Event range is invalid", {
      status: 400,
      title: "Invalid Data",
      color: "warning",
    });
  }

  return { parsedStart, parsedEnd };
}

async function ensureNoFunctionHallBookingOverlap(
  guestId: string,
  parsedStart: Date,
  parsedEnd: Date,
) {
  const { data: existing, error } = await supabase
    .from("function_hall_bookings")
    .select("id, event_start, event_end, status")
    .eq("guest_id", guestId)
    .not("status", "in", "(cancelled,completed)");

  if (error) {
    throw new ApiRouteError(error.message);
  }

  const hasOverlap = existing?.some((booking) => {
    const existingStart = parseBookingBoundaryDateTime(booking as any, "start");
    const existingEnd =
      parseBookingBoundaryDateTime(booking as any, "end") || existingStart;

    if (!existingStart || !existingEnd) {
      return false;
    }

    return parsedStart < existingEnd && parsedEnd > existingStart;
  });

  if (hasOverlap) {
    throw new ApiRouteError(
      "Guest already has an existing booking that overlaps this event schedule.",
      {
        status: 409,
        title: "Booking Conflict",
        color: "warning",
      },
    );
  }
}

export async function listFunctionHallBookings({
  query = "",
  guest_id = "",
  status = "",
  start,
  end,
  page,
  limit,
}: ListFunctionHallBookingsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const hasDateRangeFilter = Boolean(start && end);

  let request = supabase
    .from("function_hall_bookings")
    .select(
      `
      *,
      guest: guest_id(*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (guest_id) request = request.eq("guest_id", guest_id);
  if (status) request = request.eq("status", status);
  if (query) {
    request = request.or(
      `booking_number.ilike.%${query}%,event_type.ilike.%${query}%,notes.ilike.%${query}%`,
    );
  }

  if (!hasDateRangeFilter) {
    request = request.range(from, to);
  }

  const { data, error, count } = await request;

  if (error) {
    throw new ApiRouteError(error.message);
  }

  if (hasDateRangeFilter && start && end) {
    const filterStartDate = parseISODateOnly(start);
    const filterEndDate = parseISODateOnly(end);

    if (!filterStartDate || !filterEndDate) {
      throw new ApiRouteError("Invalid start or end date filter.", {
        status: 400,
        title: "Invalid Date Filter",
        color: "warning",
      });
    }

    const filtered = (data ?? []).filter((booking) => {
      const bookingStart = parseBookingBoundaryDateOnly(booking, "start");
      const bookingEnd =
        parseBookingBoundaryDateOnly(booking, "end") || bookingStart;

      if (!bookingStart || !bookingEnd) {
        return false;
      }

      return bookingStart >= filterStartDate && bookingEnd <= filterEndDate;
    });

    return {
      data: filtered.slice(from, to + 1).map(sanitizeFunctionHallBooking),
      pagination: {
        page,
        limit,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / limit),
      },
    };
  }

  return {
    data: (data ?? []).map(sanitizeFunctionHallBooking),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function createFunctionHallBooking(formData: FormData) {
  const formObj = Object.fromEntries(formData.entries());
  const eventStart = String(formObj.event_start ?? "");
  const eventEnd = String(formObj.event_end ?? "");
  const { parsedStart, parsedEnd } = assertValidFunctionHallDateRange(
    eventStart,
    eventEnd,
  );

  const bookingNumber = await GenerateBookingNumber("function-room");
  if (!bookingNumber) {
    throw new ApiRouteError("Failed to generate booking number");
  }

  const newBooking = {
    booking_number: bookingNumber,
    guest_id: String(formObj.guest_id ?? ""),
    event_type: String(formObj.event_type ?? ""),
    number_of_guest: Number(formObj.number_of_guest),
    event_start: eventStart,
    event_end: eventEnd,
    notes: String(formObj.notes ?? ""),
    status: formObj.status === "confirmed" ? "confirmed" : "pending",
    booking_source:
      formObj.booking_source === "walk-in" ? "walk-in" : "online",
  };

  if (!newBooking.guest_id || !newBooking.event_type) {
    throw new ApiRouteError("Guest and event type are required", {
      status: 400,
      title: "Invalid Data",
      color: "warning",
    });
  }

  if (
    !Number.isFinite(newBooking.number_of_guest) ||
    newBooking.number_of_guest <= 0
  ) {
    throw new ApiRouteError("Number of guest must be greater than zero", {
      status: 400,
      title: "Invalid Data",
      color: "warning",
    });
  }

  await ensureNoFunctionHallBookingOverlap(
    newBooking.guest_id,
    parsedStart,
    parsedEnd,
  );

  const { data, error } = await supabase
    .from("function_hall_bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  const guestInfo = await supabase
    .from("guest")
    .select("full_name, email")
    .eq("id", newBooking.guest_id)
    .single();

  let message: {
    title: string;
    description: string;
    color: "success" | "warning";
  } = {
    title: "Success",
    description: "Reservation successfully added.",
    color: "success" as const,
  };

  if (guestInfo.error) {
    message = {
      title: "Booked With Email Warning",
      description:
        "Reservation successfully added, but the receipt email could not be sent: Guest email could not be loaded.",
      color: "warning",
    };
  } else if (!guestInfo.data?.email) {
    message = {
      title: "Booked With Email Warning",
      description:
        "Reservation successfully added, but the receipt email could not be sent: Guest has no email address on file.",
      color: "warning",
    };
  } else {
    try {
      const emailContent = buildFunctionRoomReceiptEmail({
        bookingNumber,
        guestName: guestInfo.data.full_name,
        eventType: newBooking.event_type,
        eventStart,
        eventEnd,
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
      const emailMessage =
        emailError instanceof Error
          ? emailError.message
          : "Failed to send function hall receipt.";

      message = {
        title: "Booked With Email Warning",
        description: `Reservation successfully added, but the receipt email could not be sent: ${emailMessage}`,
        color: "warning",
      };
    }
  }

  return { data, message };
}

export async function deleteFunctionHallBookings(selectedValues: number[] | "all") {
  let request = supabase.from("function_hall_bookings").delete();

  if (selectedValues === "all") {
  } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    request = request.in("id", selectedValues.map(String));
  } else {
    throw new ApiRouteError("No items selected", {
      status: 400,
      title: "Invalid Request",
      color: "warning",
    });
  }

  const { error } = await request;

  if (error) {
    throw new ApiRouteError(error.message);
  }
}

export async function getFunctionHallBookingById(id: string) {
  const { data, error } = await supabase
    .from("function_hall_bookings")
    .select(FUNCTION_HALL_BOOKING_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      title: "API Error",
    });
  }

  return data;
}

export async function updateFunctionHallBookingById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data: currentBooking, error: currentBookingError } = await supabase
    .from("function_hall_bookings")
    .select(
      "id, booking_number, guest_id, event_type, event_start, event_end, number_of_guest, notes, status, payment_status, payment_method, amount_paid, total_amount, balance",
    )
    .eq("id", id)
    .single();

  if (currentBookingError || !currentBooking) {
    throw new ApiRouteError("Booking not found", {
      status: 404,
      color: "error",
    });
  }

  const hasTotalAmountUpdate = Object.prototype.hasOwnProperty.call(
    body,
    "total_amount",
  );
  const hasAmountPaidUpdate = Object.prototype.hasOwnProperty.call(
    body,
    "amount_paid",
  );
  const hasPaymentMethodUpdate = Object.prototype.hasOwnProperty.call(
    body,
    "payment_method",
  );
  const shouldRecomputePayment =
    hasTotalAmountUpdate || hasAmountPaidUpdate || hasPaymentMethodUpdate;
  const currentTotalAmount = toNumberOr(currentBooking.total_amount, 0);
  const currentAmountPaid = toNumberOr(currentBooking.amount_paid, 0);
  const totalAmount = hasTotalAmountUpdate
    ? toNumberOr(body.total_amount, currentTotalAmount)
    : currentTotalAmount;
  const amountPaid = hasAmountPaidUpdate
    ? toNumberOr(body.amount_paid, currentAmountPaid)
    : currentAmountPaid;

  if (totalAmount < 0 || amountPaid < 0) {
    throw new ApiRouteError("Amount values cannot be negative.", {
      status: 400,
      title: "Invalid Payment Data",
      color: "warning",
    });
  }

  if (hasAmountPaidUpdate && totalAmount <= 0) {
    throw new ApiRouteError(
      "Set the total amount first before recording a payment.",
      {
        status: 400,
        title: "Total Amount Required",
        color: "warning",
      },
    );
  }

  if (amountPaid > totalAmount && totalAmount > 0) {
    throw new ApiRouteError("Amount paid cannot be greater than total amount.", {
      status: 400,
      title: "Invalid Payment Data",
      color: "warning",
    });
  }

  const updatePayload = shouldRecomputePayment
    ? {
        ...body,
        total_amount: totalAmount,
        amount_paid: amountPaid,
        payment_status: resolvePaymentStatus(totalAmount, amountPaid),
        balance: totalAmount > 0 ? Math.max(totalAmount - amountPaid, 0) : 0,
      }
    : body;

  const { data, error } = await supabase
    .from("function_hall_bookings")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      title: "Database Error",
      color: "error",
      extra: { error: error.message },
    });
  }

  if (!data) {
    throw new ApiRouteError("Item not found", {
      status: 404,
      color: "error",
    });
  }

  const statusChanged = (currentBooking.status ?? null) !== (data.status ?? null);

  if (statusChanged && data.status === "confirmed") {
    const guestInfo = await supabase
      .from("guest")
      .select("full_name, email")
      .eq("id", String(data.guest_id ?? currentBooking.guest_id ?? ""))
      .single();

    if (!guestInfo.error && guestInfo.data?.email) {
      try {
        const emailContent = buildFunctionRoomBookingUpdateEmail({
          bookingNumber: String(
            data.booking_number ?? currentBooking.booking_number ?? "",
          ),
          guestName: guestInfo.data.full_name,
          eventType: String(data.event_type ?? currentBooking.event_type ?? "Event"),
          eventStart: String(data.event_start ?? currentBooking.event_start ?? ""),
          eventEnd: String(data.event_end ?? currentBooking.event_end ?? ""),
          numberOfGuests: data.number_of_guest,
          notes: data.notes ? String(data.notes) : null,
          status: String(data.status ?? ""),
          intro: buildFunctionHallUpdateIntro(),
        });

        await sendEmail({
          to: guestInfo.data.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error(
          "Failed to send function hall booking update email:",
          emailError,
        );
      }
    }
  }

  return data;
}

export async function deleteFunctionHallBookingById(id: string) {
  const { error } = await supabase
    .from("function_hall_bookings")
    .delete()
    .eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
