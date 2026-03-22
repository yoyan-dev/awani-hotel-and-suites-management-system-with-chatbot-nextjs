import React from "react";
import {
  Button,
  Select,
  SelectItem,
  DateRangePicker,
  Selection,
} from "@heroui/react";
import { Download, Plus, RefreshCw } from "lucide-react";
import { bookingStatusOptions } from "@/app/constants/booking";
import {
  Booking,
  BookingPagination,
  FetchBookingParams,
} from "@/types/booking";
import { CalendarDate } from "@heroui/system/dist/types";
import ExpandedBookingTable from "../modals/expanded-table-modal";
import { Room } from "@/types/room";
import Link from "next/link";
import { useBookings } from "@/hooks/use-bookings";
import type { ColumnType } from "@/types/column";
import { saveReportPdf } from "@/lib/pdf/report-pdf";
import { buildRoomBookingsReportOptions } from "@/lib/pdf/booking-reports";
import { fetchAllRoomBookings } from "@/lib/pdf/booking-export";

interface Props {
  bookings: Booking[];
  pagination: BookingPagination;
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;
  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;
  bookingLoading: boolean;
  handleSubmit: (booking: Booking, room: Room) => void;
  bookingsCount: number;
  headerColumns: ColumnType[];
}

const toDateString = (date: CalendarDate | null) =>
  date
    ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(
        date.day,
      ).padStart(2, "0")}`
    : null;

export const TableTopContent: React.FC<Props> = ({
  bookings,
  pagination,
  query,
  setQuery,
  selectedKeys,
  setSelectedKeys,
  bookingLoading,
  handleSubmit,
  bookingsCount,
  headerColumns,
}) => {
  const { fetchBookings } = useBookings();
  const [isExporting, setIsExporting] = React.useState(false);
  const filterResetKey = `${query.status ?? ""}-${query.date_range?.start ?? ""}-${query.date_range?.end ?? ""}`;

  const handleDateRangeChange = (range: {
    start: CalendarDate | null;
    end: CalendarDate | null;
  }) => {
    setQuery({
      ...query,
      page: 1,
      date_range: {
        start: toDateString(range.start),
        end: toDateString(range.end),
      },
    });
  };

  const handleStatusChange = (status: string) =>
    setQuery({ ...query, page: 1, status });

  const clearFilters = () =>
    setQuery({
      ...query,
      page: 1,
      query: "",
      status: undefined,
      date_range: undefined,
      checked_in: undefined,
      checked_out: undefined,
    });

  const handleExportPdf = async () => {
    if (isExporting || bookingsCount === 0) return;
    setIsExporting(true);
    try {
      const exportBookings = await fetchAllRoomBookings(query);
      const options = buildRoomBookingsReportOptions({
        bookings: exportBookings.length ? exportBookings : bookings,
        columns: headerColumns,
        query,
        title: "Room Bookings Report",
      });
      await saveReportPdf(options);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end flex-wrap">
        <DateRangePicker
          key={`date-${filterResetKey}`}
          variant="bordered"
          size="sm"
          radius="sm"
          className="max-w-xs"
          label="Stay duration"
          onChange={(e) =>
            handleDateRangeChange({
              start: e?.start ?? null,
              end: e?.end ?? null,
            })
          }
        />

        <div className="flex gap-3">
          <Select
            key={`status-${filterResetKey}`}
            size="sm"
            radius="sm"
            items={bookingStatusOptions}
            className="min-w-32"
            placeholder="Select Status"
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {(item) => <SelectItem key={item.uid}>{item.name}</SelectItem>}
          </Select>
          <Button
            size="sm"
            fullWidth
            radius="sm"
            variant="flat"
            onPress={clearFilters}
          >
            Clear Filters
          </Button>
          <Button
            size="sm"
            fullWidth
            variant="bordered"
            startContent={<Download size={16} />}
            onPress={handleExportPdf}
            isDisabled={bookingsCount === 0 || isExporting}
            isLoading={isExporting}
          >
            Export PDF
          </Button>
          <Button
            as={Link}
            href="/front-office/bookings/room-bookings/add-booking"
            color="primary"
            size="sm"
            fullWidth
          >
            Booking <Plus />
          </Button>
          <ExpandedBookingTable
            bookings={bookings}
            pagination={pagination}
            query={query}
            setQuery={setQuery}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            bookingLoading={bookingLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {bookingsCount} bookings
        </span>
        <label className="flex items-center gap-4 text-default-600 dark:text-default-300 text-small">
          <div>Rows per page: 10</div>
          <Button isIconOnly size="sm" onPress={() => fetchBookings(query)}>
            <RefreshCw />
          </Button>
        </label>
      </div>
    </div>
  );
};
