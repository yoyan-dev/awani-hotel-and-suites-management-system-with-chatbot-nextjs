"use client";

import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Room, RoomType } from "@/types/room";
import { Booking } from "@/types/booking";
import { getNights } from "@/utils/pricing";
import { bookingStatusHexColorMap } from "@/app/constants/booking";
import ViewModal from "./modals/view-modal";
import CalendarHeader from "./calendar-custom/calendar-header";
import { useBookings } from "@/hooks/use-bookings";

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
  rooms,
  calendarRef,
  bookings,
  selectedName,
  selectedRoomType,
  setSelectedRoomType,
  roomType,
}: {
  rooms: Room[];
  calendarRef: any;
  bookings: Booking[];
  selectedName: string;
  selectedRoomType: string;
  setSelectedRoomType: React.Dispatch<React.SetStateAction<string>>;
  roomType: RoomType[];
}) {
  const [events, setEvents] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<any>();

  React.useEffect(() => {
    if (!bookings) return;
    const mapped = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.user?.full_name || "Unknown Guest"} ● ${getNights(
        booking.check_in,
        booking.check_out
      )} night/nights (Room ${booking.room?.room_number || "Not assigned"} - ${booking.room_type.name})`,
      start: new Date(booking.check_in),
      end: new Date(booking.check_out),
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
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
    console.log(start, end);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedData(event);
    setIsOpen(true);
  };

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: "4px",
      padding: "2px 4px",
      fontSize: "0.75rem",
      color: "#fff",
    },
  });

  const resources = React.useMemo(() => {
    if (!rooms) return [];
    return rooms.map((room) => ({
      id: room.id,
      title: `${String(room?.room_number)} - ${room.status?.toUpperCase()}`,
    }));
  }, [rooms]);

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
        onEventDrop={handleEventDrop}
        eventPropGetter={eventStyleGetter}
        selectable
        components={{
          toolbar: (props) => (
            <CalendarHeader
              selectedView={props.view}
              label={props.label}
              onNavigate={props.onNavigate}
              onView={props.onView}
              views={["week", "day", "agenda", "month"]}
              selectedName={selectedName}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              roomType={roomType}
            />
          ),
        }}
      />
    </div>
  );
}
