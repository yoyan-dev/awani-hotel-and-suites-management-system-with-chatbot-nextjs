"use client";

import { CalendarView } from "./_components/calendar-view";
import { useHousekeepingCalendarPage } from "@/hooks/housekeeping/use-housekeeping-calendar-page";

export default function Calendar() {
  const calendarState = useHousekeepingCalendarPage();

  return (
    <div className="  space-y-4">
      <h1 className="text-2xl font-bold text-center bg-primary text-white py-2">
        Booking Calendar
      </h1>
      <div className=" p-2 md:p-4 bg-white dark:bg-gray-900 rounded">
        Bookings for <span className="font-bold text-primary">{calendarState.selectedName}</span>
        <CalendarView {...calendarState} />
      </div>
    </div>
  );
}
