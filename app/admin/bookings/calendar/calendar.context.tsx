"use client";

import React, { createContext, useContext, useState } from "react";
import { FetchBookingParams } from "@/types/booking";

type CalendarContextType = {
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;

  selectedRoomType: string;
  setSelectedRoomType: (v: string) => void;

  selectedRoom: string;
  setSelectedRoom: (v: string) => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [query, setQuery] = useState<FetchBookingParams>({});
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  return (
    <CalendarContext.Provider
      value={{
        query,
        setQuery,
        selectedRoomType,
        setSelectedRoomType,
        selectedRoom,
        setSelectedRoom,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error("useCalendarContext must be used inside CalendarProvider");
  }
  return ctx;
};
