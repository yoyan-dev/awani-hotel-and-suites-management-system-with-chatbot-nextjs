import { Search } from "lucide-react";
import React from "react";
import AddModal from "./modals/add-modal";
import { FetchBookingParams } from "@/types/booking";

export default function BookingHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      {/* Title + Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Bookings Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick snapshot of today's and upcoming bookings.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-default-200 rounded-lg px-3 py-2 shadow-sm w-full sm:w-64">
          <Search size={16} />
          <input
            placeholder="Search guest, id, room..."
            className="bg-transparent outline-none text-sm flex-1 text-slate-700 dark:text-slate-200"
          />
        </div>

        <div>
          <select className="w-full sm:w-auto rounded-lg px-3 py-2 bg-white dark:bg-gray-800 border border-default-200 shadow-sm text-sm">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <AddModal query={{} as FetchBookingParams} />
      </div>
    </div>
  );
}
