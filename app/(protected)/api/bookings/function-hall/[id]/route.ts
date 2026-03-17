import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { sendEmail } from "@/lib/email/emailjs";
import { buildFunctionRoomBookingUpdateEmail } from "@/lib/email/receipt-templates";

const toNumberOr = (value: unknown, fallback: number): number => {
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

//GET ONE
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: booking, error } = await supabase
    .from("function_hall_bookings")
    .select(
      `
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
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching booking:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "API Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: booking as FunctionHallBooking,
    },
    { status: 200 },
  );
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();

  const { data: currentBooking, error: currentBookingError } = await supabase
    .from("function_hall_bookings")
    .select("id, booking_number, guest_id, event_type, event_start, event_end, number_of_guest, notes, status, payment_status, payment_method, amount_paid, total_amount, balance")
    .eq("id", id)
    .single();

  if (currentBookingError || !currentBooking) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Booking not found",
          color: "error",
        },
      },
      { status: 404 },
    );
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
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid Payment Data",
          description: "Amount values cannot be negative.",
          color: "warning",
        },
      },
      { status: 400 },
    );
  }

  if (hasAmountPaidUpdate && totalAmount <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Total Amount Required",
          description:
            "Set the total amount first before recording a payment.",
          color: "warning",
        },
      },
      { status: 400 },
    );
  }

  if (amountPaid > totalAmount && totalAmount > 0) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid Payment Data",
          description: "Amount paid cannot be greater than total amount.",
          color: "warning",
        },
      },
      { status: 400 },
    );
  }

  const paymentStatus = resolvePaymentStatus(totalAmount, amountPaid);
  const balance = totalAmount > 0 ? Math.max(totalAmount - amountPaid, 0) : 0;

  const updatePayload = shouldRecomputePayment
    ? {
        ...body,
        total_amount: totalAmount,
        amount_paid: amountPaid,
        payment_status: paymentStatus,
        balance,
      }
    : body;

  const { data, error } = await supabase
    .from("function_hall_bookings")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Database Error",
          description: error.message,
          color: "error",
        },
        error: error.message,
      },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Item not found",
          color: "error",
        },
      },
      { status: 404 },
    );
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
        console.error("Failed to send function hall booking update email:", emailError);
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Booking updated successfully",
      color: "success",
    },
    data: data,
  });
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase
    .from("function_hall_bookings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Item deleted successfully",
        color: "success",
      },
    },
    { status: 200 },
  );
}
