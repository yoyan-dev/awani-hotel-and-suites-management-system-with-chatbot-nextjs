import type { ColumnType } from "@/types/column";
import type { Booking, FetchBookingParams } from "@/types/booking";
import type {
  FunctionHallBooking,
  FetchFunctionHallBookingParams,
} from "@/types/function-room-booking";
import { getNights } from "@/utils/pricing";
import { formateDateAndTime } from "@/app/utils/to-date-range";
import type { ReportPdfOptions } from "@/lib/pdf/report-pdf";

type CellValue = string | number | boolean | null | undefined;

const getRecordValue = (record: object, key: string): CellValue => {
  return (record as unknown as Record<string, CellValue>)[key];
};

const normalizeColumns = (columns: ColumnType[]) =>
  columns
    .filter((column) => column.uid !== "actions")
    .map((column) => ({ header: column.name, dataKey: column.uid }));

const formatMoney = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numeric =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  if (Number.isNaN(numeric)) return "N/A";

  const formatted = numeric.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `P ${formatted}`;
};

const formatDateLabel = (value?: string) => {
  if (!value) return "Any";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatRangeLabel = (
  start?: string,
  end?: string,
  label = "Date range",
) => {
  if (!start && !end) return undefined;
  return `${label}: ${formatDateLabel(start)} - ${formatDateLabel(end)}`;
};

const formatEventRange = (start?: string, end?: string) => {
  const startText = formateDateAndTime(start) ?? "N/A";
  const endText = end ? formateDateAndTime(end) : null;
  if (endText) return `${startText} to ${endText}`;
  return startText;
};

const getRoomBookingValue = (booking: Booking, key: string): CellValue => {
  switch (key) {
    case "booking_number":
      return booking.booking_number ?? "N/A";
    case "guest_name":
      return booking.user?.full_name ?? "N/A";
    case "number_of_guests":
      return booking.number_of_guests ?? "N/A";
    case "recent_sickness":
      return Array.isArray(booking.recent_sickness)
        ? booking.recent_sickness.join(", ")
        : (booking.recent_sickness ?? "N/A");
    case "room":
      return booking.room?.room_number ?? "N/A";
    case "room_type":
      return booking.room_type?.name ?? "N/A";
    case "nights":
      return getNights(booking.checked_in, booking.checked_out);
    case "checked_in_out":
      return `${booking.checked_in} to ${booking.checked_out}`;
    case "checked_in":
      return booking.checked_in ?? "N/A";
    case "checked_out":
      return booking.checked_out ?? "N/A";
    case "company":
      return booking.company ?? "N/A";
    case "places_last_visited":
      return booking.places_last_visited ?? "N/A";
    case "purpose":
      return booking.purpose ?? "N/A";
    case "request_messages":
      return booking.request_messages ?? "N/A";
    case "payment_method":
      return booking.payment_method ?? "N/A";
    case "booking_source":
      return booking.booking_source ?? "N/A";
    case "amount_paid":
      return formatMoney(booking.amount_paid);
    case "total_price":
      return formatMoney(booking.total);
    case "payment_status":
      return booking.payment_status ?? "pending";
    case "status":
      return booking.status ?? "N/A";
    default:
      return getRecordValue(booking, key) ?? "N/A";
  }
};

const getFunctionHallBookingValue = (
  booking: FunctionHallBooking,
  key: string,
): CellValue => {
  switch (key) {
    case "booking_number":
      return booking.booking_number ?? "N/A";
    case "event_type":
      return booking.event_type ?? "N/A";
    case "event_start":
      return formatEventRange(booking.event_start, booking.event_end);
    case "guest":
      return booking.guest?.full_name ?? "N/A";
    case "number_of_guest":
      return booking.number_of_guest ?? "N/A";
    case "room":
      return booking.room?.room_number ?? booking.room?.name ?? "N/A";
    case "occupancy_type":
      return booking.occupancy_type ?? "N/A";
    case "total_amount":
      return formatMoney(booking.total_amount);
    case "amount_paid":
      return formatMoney(booking.amount_paid);
    case "balance":
      return formatMoney(booking.balance);
    case "payment_status":
      return booking.payment_status ?? "pending";
    case "notes":
      return booking.notes ?? "N/A";
    case "status":
      return booking.status ?? "N/A";
    default:
      return getRecordValue(booking, key) ?? "N/A";
  }
};

export function buildRoomBookingsReportOptions(params: {
  bookings: Booking[];
  columns: ColumnType[];
  query: FetchBookingParams;
  title?: string;
}) {
  const columns = normalizeColumns(params.columns);
  const rows = params.bookings.map((booking) => {
    const record: Record<string, CellValue> = {};
    columns.forEach((column) => {
      record[column.dataKey] = getRoomBookingValue(booking, column.dataKey);
    });
    return record;
  });

  const dateRange = formatRangeLabel(
    params.query.date_range?.start,
    params.query.date_range?.end,
    "Stay duration",
  );

  return {
    title: params.title ?? "Room Bookings Report",
    dateRange,
    columns,
    rows,
    meta: {
      generatedAt: new Date().toLocaleString("en-US"),
    },
  } satisfies ReportPdfOptions;
}

export function buildFunctionHallBookingsReportOptions(params: {
  bookings: FunctionHallBooking[];
  columns: ColumnType[];
  query: FetchFunctionHallBookingParams;
  title?: string;
}) {
  const columns = normalizeColumns(params.columns);
  const rows = params.bookings.map((booking) => {
    const record: Record<string, CellValue> = {};
    columns.forEach((column) => {
      record[column.dataKey] = getFunctionHallBookingValue(
        booking,
        column.dataKey,
      );
    });
    return record;
  });

  const dateRange = formatRangeLabel(
    params.query.event_start,
    params.query.event_end,
    "Event dates",
  );

  return {
    title: params.title ?? "Function Hall Bookings Report",
    dateRange,
    columns,
    rows,
    meta: {
      generatedAt: new Date().toLocaleString("en-US"),
    },
  } satisfies ReportPdfOptions;
}
