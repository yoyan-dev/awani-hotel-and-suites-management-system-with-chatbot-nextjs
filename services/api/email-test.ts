import { ApiRouteError } from "@/lib/api/route-error";
import { sendEmail } from "@/lib/email/emailjs";
import {
  buildFunctionRoomReceiptEmail,
  buildHotelReceiptEmail,
} from "@/lib/email/receipt-templates";

type EmailTemplateType = "custom" | "hotel" | "function-hall";

export type EmailTestPayload = {
  to?: string;
  template?: EmailTemplateType;
  subject?: string;
  message?: string;
  guestName?: string;
  bookingNumber?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCustomEmailContent(payload: EmailTestPayload) {
  const subject = payload.subject?.trim() || "Sample Email from Awani";
  const message =
    payload.message?.trim() ||
    "This is a sample email sent from the Awani admin test page.";
  const formattedMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return {
    subject,
    text: message,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f2937;">
        <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Awani Email Test</p>
        <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">${escapeHtml(subject)}</h1>
        <p style="margin:0;font-size:15px;line-height:1.7;">${formattedMessage}</p>
      </div>
    `,
  };
}

function buildTemplateContent(payload: EmailTestPayload) {
  const template = payload.template || "custom";
  const guestName = payload.guestName?.trim() || "Sample Guest";
  const bookingNumber = payload.bookingNumber?.trim() || "AWN-TEST-001";

  if (template === "hotel") {
    return buildHotelReceiptEmail({
      bookingNumber,
      guestName,
      roomTypeName: "Deluxe Suite",
      checkIn: "2026-03-20",
      checkOut: "2026-03-22",
      numberOfGuests: 2,
      total: 6200,
      totalAddOns: 700,
      specialRequests: [
        { name: "Airport Pickup", price: 500, quantity: 1 },
        { name: "Breakfast Buffet", price: 100, quantity: 2 },
      ],
    });
  }

  if (template === "function-hall") {
    return buildFunctionRoomReceiptEmail({
      bookingNumber,
      guestName,
      eventType: "Corporate Planning Session",
      eventStart: "2026-03-25T09:00:00+08:00",
      eventEnd: "2026-03-25T17:00:00+08:00",
      numberOfGuests: 40,
      notes: "Sample event created from the admin email test page.",
    });
  }

  return buildCustomEmailContent(payload);
}

export async function sendTestEmail(payload: EmailTestPayload) {
  const to = payload.to?.trim();
  if (!to) {
    throw new ApiRouteError(
      "Please provide an email address to send the sample email.",
      { status: 400, title: "Recipient Required", color: "warning" },
    );
  }

  const emailContent = buildTemplateContent(payload);
  const result = await sendEmail({
    to,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  return {
    id: result.data?.id ?? null,
    to,
    template: payload.template || "custom",
    subject: emailContent.subject,
  };
}
