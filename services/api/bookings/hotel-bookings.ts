import { createGuestBreakdown, getGuestBreakdownTotal, parseGuestBreakdown } from "@/lib/booking/guest-breakdown";
import { buildHotelBookingUpdateEmail, buildHotelReceiptEmail } from "@/lib/email/receipt-templates";
import { sendEmail } from "@/lib/email/emailjs";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";
import { BookingSpecialRequest } from "@/types/add-on";
import { TablesInsert } from "@/types/supabase";
import {
  HOTEL_BOOKING_SELECT,
  computeTotalAddOns,
  getRoomTypeWithAvailability,
  sanitizeSpecialRequests,
} from "@/services/api/bookings/hotel-bookings-shared";

async function resolveAndValidateRequests(
  roomTypeId: string,
  checkedIn: string,
  checkedOut: string,
  rawRequests: BookingSpecialRequest[],
  bookingId?: string,
) {
  const { roomType, addOns } = await getRoomTypeWithAvailability(
    roomTypeId,
    checkedIn,
    checkedOut,
    bookingId,
  );
  const cleaned = sanitizeSpecialRequests(rawRequests, addOns);
  const totalAddOns = computeTotalAddOns(cleaned);

  return { roomType, cleaned, totalAddOns };
}

const buildHotelUpdateIntro = () => {
  return "Your hotel room booking has been confirmed. Please review the latest booking summary below.";
};

type ListHotelBookingsParams = {
  roomTypeID?: string | null;
  guest_id?: string | null;
  status?: string | null;
  start?: string | null;
  end?: string | null;
  page: number;
  limitParam: string;
};

export async function listHotelBookings({
  roomTypeID,
  guest_id,
  status,
  start,
  end,
  page,
  limitParam,
}: ListHotelBookingsParams) {
  const limit = limitParam === "all" ? null : Number(limitParam);
  const from = limit ? (page - 1) * limit : 0;
  const to = limit ? from + limit - 1 : undefined;

  let query = supabase
    .from("bookings")
    .select(HOTEL_BOOKING_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (roomTypeID) query = query.eq("room_type_id", roomTypeID);
  if (guest_id) query = query.eq("guest_id", guest_id);
  if (status) query = query.eq("status", status);
  if (start && end) {
    query = query.gte("checked_in", start).lte("checked_in", end);
  }
  if (limit && to !== undefined) {
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return {
    data: data ?? [],
    pagination: {
      page,
      limit: limit ?? 10,
      total: count ?? 0,
      total_pages:
        limitParam === "all" ? 1 : Math.ceil((count ?? 0) / (limit ?? 1)),
    },
  };
}

export async function createHotelBooking(formData: FormData) {
  const formObj = Object.fromEntries(formData.entries());
  const bookingNumber = await GenerateBookingNumber("hotel-room");

  if (!bookingNumber) {
    throw new ApiRouteError("Unknow Error, Please try again", {
      status: 400,
      title: "Unknown Error!",
      color: "warning",
    });
  }

  const roomTypeId = String(formObj.room_type_id ?? "");
  const checkedIn = String(formObj.checked_in ?? "");
  const checkedOut = String(formObj.checked_out ?? "");
  const guestId = String(formObj.guest_id ?? "");

  if (!guestId || !roomTypeId || !checkedIn || !checkedOut) {
    throw new ApiRouteError(
      "guest_id, room_type_id, checked_in, and checked_out are required.",
      {
        status: 400,
        title: "Invalid Data",
        color: "warning",
      },
    );
  }

  const requestedSpecialRequests = JSON.parse(
    String(formObj.special_requests ?? "[]"),
  ) as BookingSpecialRequest[];
  const guestBreakdown = parseGuestBreakdown(formObj.guest_breakdown);
  const { roomType, cleaned, totalAddOns } = await resolveAndValidateRequests(
    roomTypeId,
    checkedIn,
    checkedOut,
    requestedSpecialRequests,
  );
  const totalGuests = guestBreakdown
    ? getGuestBreakdownTotal(guestBreakdown)
    : Number(formObj.number_of_guests ?? 0);

  if (!Number.isFinite(totalGuests) || totalGuests <= 0) {
    throw new ApiRouteError(
      "Please provide at least one guest category for this booking.",
      {
        status: 400,
        title: "Invalid Guest Count",
        color: "warning",
      },
    );
  }

  if (roomType.max_guest && totalGuests > Number(roomType.max_guest)) {
    throw new ApiRouteError(
      `Maximum guests allowed for this room is ${roomType.max_guest}.`,
      {
        status: 400,
        title: "Guest Limit Exceeded",
        color: "warning",
      },
    );
  }

  const newData: TablesInsert<"bookings"> = {
    booking_number: bookingNumber,
    guest_id: guestId,
    room_type_id: roomTypeId,
    room_id: formObj.room_id ? String(formObj.room_id) : null,
    checked_in: checkedIn,
    checked_out: checkedOut,
    number_of_guests: String(totalGuests),
    guest_breakdown:
      (guestBreakdown as unknown as TablesInsert<"bookings">["guest_breakdown"]) ??
      null,
    payment_status: formObj.payment_status ? String(formObj.payment_status) : null,
    payment_method: formObj.payment_method ? String(formObj.payment_method) : null,
    booking_source: formObj.booking_source ? String(formObj.booking_source) : "online",
    amount_paid: formObj.amount_paid ? Number(formObj.amount_paid) : null,
    total: formObj.total ? String(formObj.total) : null,
    status: formObj.status ? String(formObj.status) : "pending",
    special_requests:
      cleaned as unknown as TablesInsert<"bookings">["special_requests"],
    total_add_ons: String(totalAddOns),
  };

  const newCheckIn = new Date(checkedIn);
  const newCheckOut = new Date(checkedOut);
  const { data: existingBookings, error: checkError } = await supabase
    .from("bookings")
    .select("id, checked_in, checked_out, status")
    .eq("guest_id", guestId)
    .not("status", "in", "(cancelled, completed, checked_out)");

  if (checkError) {
    throw new ApiRouteError(checkError.message);
  }

  const hasOverlap = existingBookings?.some((booking) => {
    if (!booking.checked_in || !booking.checked_out) return false;
    const existingIn = new Date(booking.checked_in);
    const existingOut = new Date(booking.checked_out);
    return newCheckIn <= existingOut && newCheckOut >= existingIn;
  });

  if (hasOverlap) {
    throw new ApiRouteError(
      "Guest already has an active booking during this period.",
      {
        status: 400,
        title: "Booking Restricted",
        color: "warning",
      },
    );
  }

  const { data, error } = await supabase.from("bookings").insert(newData).select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Booking already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  const guestInfo = await supabase
    .from("guest")
    .select("full_name, email")
    .eq("id", guestId)
    .single();

  let message: {
    title: string;
    description: string;
    color: "success" | "warning";
  } = {
    title: "Success",
    description: "Reservation successfully added.",
    color: "success",
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
      const emailContent = buildHotelReceiptEmail({
        bookingNumber,
        guestName: guestInfo.data.full_name,
        roomTypeName: roomType?.name ?? "Room",
        checkIn: checkedIn,
        checkOut: checkedOut,
        numberOfGuests: newData.number_of_guests,
        total: newData.total,
        totalAddOns,
        specialRequests: cleaned,
      });

      await sendEmail({
        to: guestInfo.data.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (emailError) {
      const emailWarning =
        emailError instanceof Error
          ? emailError.message
          : "Failed to send hotel booking receipt.";
      message = {
        title: "Booked With Email Warning",
        description: `Reservation successfully added, but the receipt email could not be sent: ${emailWarning}`,
        color: "warning",
      };
    }
  }

  return {
    data: data?.[0],
    message,
  };
}

export async function deleteHotelBookings(selectedValues: number[] | "all") {
  let query = supabase.from("bookings").delete();

  if (selectedValues === "all") {
  } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    query = query.in("id", selectedValues.map(String));
  } else {
    throw new ApiRouteError(String(selectedValues), {
      status: 400,
      color: "warning",
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new ApiRouteError("Failed to delete items.", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}

export async function getHotelBookingById(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(HOTEL_BOOKING_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      title: "API Error",
    });
  }

  return data;
}

export async function updateHotelBookingById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data: existingBooking, error: existingError } = await supabase
    .from("bookings")
    .select(
      "id, booking_number, guest_id, room_type_id, checked_in, checked_out, special_requests, guest_breakdown, number_of_guests, status, payment_status, payment_method, amount_paid, total",
    )
    .eq("id", id)
    .single();

  if (existingError) {
    throw new ApiRouteError(existingError.message, {
      status: 500,
      color: "error",
    });
  }

  if (!existingBooking) {
    throw new ApiRouteError("Item not found", {
      status: 404,
      color: "error",
    });
  }

  const roomTypeId = String(body.room_type_id ?? existingBooking.room_type_id);
  const checkedIn = String(body.checked_in ?? existingBooking.checked_in);
  const checkedOut = String(body.checked_out ?? existingBooking.checked_out);
  const rawRequests = (body.special_requests ??
    existingBooking.special_requests ??
    []) as BookingSpecialRequest[];
  const guestBreakdown =
    body.guest_breakdown !== undefined
      ? parseGuestBreakdown(body.guest_breakdown)
      : body.number_of_guests !== undefined
        ? createGuestBreakdown({
            adult: Number(body.number_of_guests ?? 0),
          })
        : parseGuestBreakdown(existingBooking.guest_breakdown);
  const totalGuests = guestBreakdown
    ? getGuestBreakdownTotal(guestBreakdown)
    : Number(body.number_of_guests ?? existingBooking.number_of_guests ?? 0);

  const { cleaned, totalAddOns } = await resolveAndValidateRequests(
    roomTypeId,
    checkedIn,
    checkedOut,
    rawRequests,
    id,
  );

  if (!Number.isFinite(totalGuests) || totalGuests <= 0) {
    throw new ApiRouteError(
      "Please provide at least one guest category for this booking.",
      {
        status: 400,
        title: "Invalid Guest Count",
        color: "warning",
      },
    );
  }

  const { data: roomType, error: roomTypeError } = await supabase
    .from("room_types")
    .select("max_guest, name")
    .eq("id", roomTypeId)
    .single();

  if (roomTypeError) {
    throw new ApiRouteError(roomTypeError.message);
  }

  if (roomType?.max_guest && totalGuests > Number(roomType.max_guest)) {
    throw new ApiRouteError(
      `Maximum guests allowed for this room is ${roomType.max_guest}.`,
      {
        status: 400,
        title: "Guest Limit Exceeded",
        color: "warning",
      },
    );
  }

  const payload = {
    ...body,
    special_requests:
      cleaned as unknown as TablesInsert<"bookings">["special_requests"],
    guest_breakdown:
      guestBreakdown as unknown as TablesInsert<"bookings">["guest_breakdown"],
    number_of_guests: String(totalGuests),
    total_add_ons:
      totalAddOns as unknown as TablesInsert<"bookings">["total_add_ons"],
  };

  const { data, error } = await supabase
    .from("bookings")
    .update(payload)
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

  const statusChanged =
    (existingBooking.status ?? null) !== (data.status ?? null);

  if (statusChanged && data.status === "confirmed") {
    const guestInfo = await supabase
      .from("guest")
      .select("full_name, email")
      .eq("id", String(data.guest_id ?? existingBooking.guest_id ?? ""))
      .single();

    if (!guestInfo.error && guestInfo.data?.email) {
      try {
        const roomInfo = data.room_id
          ? await supabase
              .from("rooms")
              .select("room_number")
              .eq("id", String(data.room_id))
              .single()
          : { data: null, error: null };

        const emailContent = buildHotelBookingUpdateEmail({
          bookingNumber: String(
            data.booking_number ?? existingBooking.booking_number ?? "",
          ),
          guestName: guestInfo.data.full_name,
          roomTypeName: (roomType as { name?: string | null })?.name ?? "Room",
          roomNumber: roomInfo.data?.room_number ?? "-",
          checkIn: String(data.checked_in ?? checkedIn),
          checkOut: String(data.checked_out ?? checkedOut),
          numberOfGuests: data.number_of_guests,
          total: data.total,
          totalAddOns: data.total_add_ons,
          specialRequests: cleaned,
          status: String(data.status ?? ""),
          intro: buildHotelUpdateIntro(),
        });

        await sendEmail({
          to: guestInfo.data.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error("Failed to send hotel booking update email:", emailError);
      }
    }
  }

  return data;
}

export async function deleteHotelBookingById(id: string) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 404,
      color: "error",
    });
  }
}
