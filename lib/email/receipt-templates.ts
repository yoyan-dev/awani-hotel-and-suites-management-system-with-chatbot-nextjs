import { formatPHP } from "@/lib/format-php";
import { BookingSpecialRequest } from "@/types/add-on";

type HotelReceiptInput = {
  bookingNumber: string;
  guestName?: string | null;
  roomTypeName?: string | null;
  checkIn: string;
  checkOut: string;
  numberOfGuests?: number | string | null;
  total?: number | string | null;
  totalAddOns?: number | string | null;
  specialRequests?: BookingSpecialRequest[];
};

type FunctionRoomReceiptInput = {
  bookingNumber: string;
  guestName?: string | null;
  eventType?: string | null;
  eventStart: string;
  eventEnd: string;
  numberOfGuests?: number | string | null;
  notes?: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildDetailsTable = (rows: Array<[string, string]>) =>
  `
  <table style="width:100%;border-collapse:collapse;">
    ${rows
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:8px 0;color:#7b6a54;font-size:13px;width:40%;">${escapeHtml(
          label,
        )}</td>
        <td style="padding:8px 0;color:#1f1a14;font-size:13px;font-weight:600;">${escapeHtml(
          value,
        )}</td>
      </tr>
    `,
      )
      .join("")}
  </table>
`;

const buildAddOnsTable = (specialRequests: BookingSpecialRequest[]) => {
  if (!specialRequests.length) {
    return `<p style="margin:0;color:#7b6a54;font-size:13px;">None</p>`;
  }

  const rows = specialRequests
    .map((item) => {
      const qty = Number(item.quantity ?? 0);
      const price = Number(item.price ?? 0);
      const total = qty * price;
      return `
        <tr>
          <td style="padding:8px 0;color:#1f1a14;font-size:13px;">${escapeHtml(
            item.name ?? "Add-on",
          )}</td>
          <td style="padding:8px 0;color:#7b6a54;font-size:13px;text-align:center;">${qty}</td>
          <td style="padding:8px 0;color:#1f1a14;font-size:13px;font-weight:600;text-align:right;">${formatPHP(
            total,
          )}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;color:#7b6a54;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Item</th>
          <th style="text-align:center;padding:8px 0;color:#7b6a54;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Qty</th>
          <th style="text-align:right;padding:8px 0;color:#7b6a54;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

export function buildHotelReceiptEmail(input: HotelReceiptInput) {
  const total = Number(input.total ?? 0);
  const totalAddOns = Number(input.totalAddOns ?? 0);
  const rows: Array<[string, string]> = [
    ["Booking #", input.bookingNumber],
    ["Guest", input.guestName || "Guest"],
    ["Room Type", input.roomTypeName || "Room"],
    ["Check-in", formatDate(input.checkIn)],
    ["Check-out", formatDate(input.checkOut)],
    ["Guests", String(input.numberOfGuests ?? "—")],
    ["Status", "Pending confirmation"],
    ["Total Add-ons", formatPHP(totalAddOns)],
    ["Estimated Total", formatPHP(total)],
  ];

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f1e8;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfce;border-radius:16px;padding:24px;">
      <h1 style="margin:0 0 8px;font-size:22px;color:#1f1a14;">Reservation Receipt</h1>
      <p style="margin:0 0 18px;color:#7b6a54;font-size:13px;">
        Thank you for choosing Awani Hotel. This email is your reservation proof.
      </p>
      ${buildDetailsTable(rows)}
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid #eadfce;">
        <h2 style="margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:#7b6a54;">
          Special Requests
        </h2>
        ${buildAddOnsTable(input.specialRequests ?? [])}
      </div>
      <p style="margin:18px 0 0;color:#7b6a54;font-size:12px;">
        Our team will confirm your reservation shortly. Keep this email for your records.
      </p>
    </div>
  </div>
  `;

  const text = [
    "Reservation Receipt",
    `Booking #: ${input.bookingNumber}`,
    `Guest: ${input.guestName || "Guest"}`,
    `Room Type: ${input.roomTypeName || "Room"}`,
    `Check-in: ${formatDate(input.checkIn)}`,
    `Check-out: ${formatDate(input.checkOut)}`,
    `Guests: ${input.numberOfGuests ?? "—"}`,
    "Status: Pending confirmation",
    `Total Add-ons: ${formatPHP(totalAddOns)}`,
    `Estimated Total: ${formatPHP(total)}`,
    "",
    "Special Requests:",
    ...(input.specialRequests?.length
      ? input.specialRequests.map((item) => {
          const qty = Number(item.quantity ?? 0);
          const price = Number(item.price ?? 0);
          return `- ${item.name ?? "Add-on"} x${qty} (${formatPHP(
            qty * price,
          )})`;
        })
      : ["- None"]),
    "",
    "Our team will confirm your reservation shortly.",
  ].join("\n");

  return {
    subject: `Awani Hotel Reservation Receipt #${input.bookingNumber}`,
    html,
    text,
  };
}

export function buildFunctionRoomReceiptEmail(input: FunctionRoomReceiptInput) {
  const rows: Array<[string, string]> = [
    ["Booking #", input.bookingNumber],
    ["Guest", input.guestName || "Guest"],
    ["Event Type", input.eventType || "Event"],
    ["Event Start", formatDateTime(input.eventStart)],
    ["Event End", formatDateTime(input.eventEnd)],
    ["Guests", String(input.numberOfGuests ?? "—")],
    ["Status", "Pending confirmation"],
  ];

  const notes = input.notes?.trim();

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f1e8;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfce;border-radius:16px;padding:24px;">
      <h1 style="margin:0 0 8px;font-size:22px;color:#1f1a14;">Function Hall Reservation Receipt</h1>
      <p style="margin:0 0 18px;color:#7b6a54;font-size:13px;">
        Thank you for booking with Awani Hotel. This email is your reservation proof.
      </p>
      ${buildDetailsTable(rows)}
      ${
        notes
          ? `
        <div style="margin-top:18px;padding-top:16px;border-top:1px solid #eadfce;">
          <h2 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:#7b6a54;">Notes</h2>
          <p style="margin:0;color:#1f1a14;font-size:13px;">${escapeHtml(
            notes,
          )}</p>
        </div>
      `
          : ""
      }
      <p style="margin:18px 0 0;color:#7b6a54;font-size:12px;">
        Our events team will contact you shortly to confirm details.
      </p>
    </div>
  </div>
  `;

  const text = [
    "Function Hall Reservation Receipt",
    `Booking #: ${input.bookingNumber}`,
    `Guest: ${input.guestName || "Guest"}`,
    `Event Type: ${input.eventType || "Event"}`,
    `Event Start: ${formatDateTime(input.eventStart)}`,
    `Event End: ${formatDateTime(input.eventEnd)}`,
    `Guests: ${input.numberOfGuests ?? "—"}`,
    "Status: Pending confirmation",
    notes ? "" : "",
    notes ? `Notes: ${notes}` : "",
    "",
    "Our events team will contact you shortly to confirm details.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `Awani Hotel Function Hall Receipt #${input.bookingNumber}`,
    html,
    text,
  };
}
