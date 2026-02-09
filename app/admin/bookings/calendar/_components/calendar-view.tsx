"use client";

import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Room, RoomType } from "@/types/room";
import { Booking, FetchBookingParams } from "@/types/booking";
import { getNights } from "@/utils/pricing";
import {
  bookingStatusHexColorMap,
  paymentStatusColorMap,
} from "@/app/constants/booking";
import ViewModal from "./modals/view-modal";
import CalendarHeader from "./calendar-custom/calendar-header";
import { useBookings } from "@/hooks/use-bookings";
import { toISODateOnly } from "@/utils/iso-format";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export function CalendarView({
  query,
  setQuery,
  rooms,
  calendarRef,
  bookings,
  selectedName,
  roomLoading,
  selectedRoomType,
  setSelectedRoomType,
  roomTypeLoading,
  roomTypes,
  selectedRoom,
  setSelectedRoom,
}: {
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;
  rooms: Room[];
  calendarRef: any;
  bookings: Booking[];
  selectedName: string;
  roomLoading: boolean;
  selectedRoomType: string;
  setSelectedRoomType: React.Dispatch<React.SetStateAction<string>>;
  roomTypeLoading: boolean;
  roomTypes: RoomType[];
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [events, setEvents] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<any>();

  React.useEffect(() => {
    if (!bookings) return;
    const mapped = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.user?.full_name || "Unknown Guest"} ● ${getNights(
        booking.checked_in,
        booking.checked_out,
      )} night/nights (Room ${booking.room?.room_number || "Not assigned"} - ${booking.room_type.name})`,
      statusColor:
        paymentStatusColorMap[booking.payment_status || "pending"] || "#CCCCCC",
      start: new Date(booking.checked_in),
      end: new Date(booking.checked_out),
      resourceId: booking.room_id || "no assigned",
      allDay: false,
      color:
        bookingStatusHexColorMap[booking.status] ||
        bookingStatusHexColorMap["default"],
    }));
    setEvents(mapped);
  }, [bookings]);

  const handleEventDrop = ({ event, start, end }: any) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev)),
    );
    console.log(start, end);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedData(event);
    setIsOpen(true);
  };

  const eventStyleGetter = (event: any) => ({
    style: {
      background: `linear-gradient(90deg, ${event.color} 0%, ${event.color} 70%, ${event.statusColor} 70%,  ${event.statusColor} 100%)`,
      border: `1px solid #fff`,
      borderRadius: "4px",
      padding: "2px 4px",
      fontSize: "0.75rem",
      color: "#fff",
    },
  });

  const resources = React.useMemo(() => {
    if (!rooms) return [];
    const mappedResources = [
      ...rooms.map((room) => ({
        id: room.id,
        title: `Room #${String(room?.room_number)} - ${room.status?.toUpperCase()}`,
      })),
      { id: "no assigned", title: "No assigned" },
    ];

    return mappedResources.filter((resource) => resource.id === selectedRoom);
  }, [rooms, selectedRoom]);

  const handleRangeChange = (range: any, view?: string) => {
    let start: Date;
    let end: Date;

    if (!Array.isArray(range) && range.start && range.end) {
      start = range.start;
      end = range.end;
    } else if (Array.isArray(range)) {
      start = range[0];
      end = range[range.length - 1];
    } else {
      return;
    }

    const startISO = toISODateOnly(start);
    const endISO = toISODateOnly(end);
    setQuery({ ...query, date_range: { start: startISO, end: endISO } });
  };

  return (
    <div className="p-4">
      <ViewModal
        data={selectedData}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <DnDCalendar
        resources={resources}
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={["week", "day", "agenda", "month"]}
        step={60}
        timeslots={1}
        defaultDate={new Date()}
        style={{ height: 600 }}
        resizable
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        onRangeChange={handleRangeChange}
        eventPropGetter={eventStyleGetter}
        selectable
        components={{
          toolbar: (props) => (
            <CalendarHeader
              selectedView={props.view}
              label={props.label}
              onNavigate={props.onNavigate}
              onView={props.onView}
              views={["week", "agenda", "month"]}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              roomTypeLoading={roomTypeLoading}
              roomTypes={roomTypes}
              roomLoading={roomLoading}
              rooms={rooms}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
          ),
        }}
      />
    </div>
  );
}
