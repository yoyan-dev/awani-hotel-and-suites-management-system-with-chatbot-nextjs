import React from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  DateRangePicker,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Download, Search, Plus, Filter, RefreshCw } from "lucide-react";
import { bookingStatusOptions } from "@/app/constants/function-hall-booking";
import { CalendarDate } from "@heroui/system/dist/types";
import Link from "next/link";
import {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
  FunctionHallBookingPagination,
} from "@/types/function-room-booking";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import type { ColumnType } from "@/types/column";
import { saveReportPdf } from "@/lib/pdf/report-pdf";
import { buildFunctionHallBookingsReportOptions } from "@/lib/pdf/booking-reports";
import { fetchAllFunctionHallBookings } from "@/lib/pdf/booking-export";

interface Props {
  bookings: FunctionHallBooking[];
  pagination: FunctionHallBookingPagination;
  query: FetchFunctionHallBookingParams;
  setQuery: React.Dispatch<
    React.SetStateAction<FetchFunctionHallBookingParams>
  >;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  bookingLoading: boolean;
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
  query,
  setQuery,
  bookingsCount,
  headerColumns,
}) => {
  const { fetchBookings } = useFunctionHallBookings();
  const [isExporting, setIsExporting] = React.useState(false);
  const filterResetKey = `${query.status ?? ""}-${query.event_start ?? ""}-${query.event_end ?? ""}`;

  const handleSearchChange = (value: string) =>
    setQuery({ ...query, query: value, page: 1 });

  const handleDateRangeChange = (range: {
    start: CalendarDate | null;
    end: CalendarDate | null;
  }) =>
    setQuery({
      ...query,
      page: 1,
      event_start: toDateString(range.start)
        ? `${toDateString(range.start)}T00:00:00.000Z`
        : undefined,
      event_end: toDateString(range.end)
        ? `${toDateString(range.end)}T23:59:59.999Z`
        : undefined,
    });

  const handleStatusChange = (status: string) =>
    setQuery({ ...query, status, page: 1 });

  const clearFilters = () =>
    setQuery({
      page: 1,
      query: "",
      status: undefined,
      event_start: undefined,
      event_end: undefined,
      date_range: undefined,
      guest_id: undefined,
    });

  const handleExportPdf = async () => {
    if (isExporting || bookingsCount === 0) return;
    setIsExporting(true);
    try {
      const exportBookings = await fetchAllFunctionHallBookings(query);
      const options = buildFunctionHallBookingsReportOptions({
        bookings: exportBookings.length ? exportBookings : bookings,
        columns: headerColumns,
        query,
        title: "Function Hall Bookings Report",
      });
      await saveReportPdf(options);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end gap-3 flex-wrap">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:w-[45%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search bookings..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query.query || ""}
          variant="bordered"
          onClear={() => handleSearchChange("")}
          onValueChange={handleSearchChange}
        />
        <div className="flex gap-4">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                startContent={<Filter size={16} />}
              >
                Filters
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-4 w-72 space-y-4">
              <h4 className="text-sm font-medium text-default-700">
                Filter Options
              </h4>

              <div className="space-y-1">
                <label className="text-xs text-default-500">Date Range</label>
                <DateRangePicker
                  key={`date-${filterResetKey}`}
                  variant="bordered"
                  size="sm"
                  radius="sm"
                  onChange={(e) =>
                    handleDateRangeChange({
                      start: e?.start ?? null,
                      end: e?.end ?? null,
                    })
                  }
                />
              </div>

              <div className="space-y-1 w-full">
                <label className="text-xs text-default-500">Status</label>
                <Select
                  key={`status-${filterResetKey}`}
                  size="sm"
                  radius="sm"
                  fullWidth
                  placeholder="Select status"
                  items={bookingStatusOptions}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {(item) => (
                    <SelectItem key={item.uid}>{item.name}</SelectItem>
                  )}
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  fullWidth
                  variant="flat"
                  onPress={clearFilters}
                >
                  Clear Filters
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  color="primary"
                  onPress={() => fetchBookings(query)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            radius="sm"
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
            href="/admin/bookings/function-hall-bookings/add-booking"
            color="primary"
            size="sm"
            startContent={<Plus size={16} />}
          >
            Booking
          </Button>
        </div>
      </div>

      {/* FOOTER: total + refresh */}
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {bookingsCount} bookings
        </span>

        <div className="flex items-center gap-3 text-small">
          <div>Rows per page: 10</div>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => fetchBookings(query)}
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
