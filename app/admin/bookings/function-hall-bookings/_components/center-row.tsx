import React from "react";

export default function CenterRow() {
  return (
    <div className="flex flex-col w-full gap-4 flex-wrap md:flex-row">
      <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Today</div>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="w-full h-36 rounded-md bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 flex items-center justify-center">
          <div className="text-center text-slate-500">
            Mini calendar placeholder
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="font-medium mb-3">Room status</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-gray-900">
            <div className="text-xs text-slate-500">Available</div>
            <div className="font-semibold text-lg">12</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-gray-900">
            <div className="text-xs text-slate-500">Occupied</div>
            <div className="font-semibold text-lg">3</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-gray-900">
            <div className="text-xs text-slate-500">Cleaning</div>
            <div className="font-semibold text-lg">2</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-gray-900">
            <div className="text-xs text-slate-500">Maintenance</div>
            <div className="font-semibold text-lg">1</div>
          </div>
        </div>
      </div>

      {/* <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="font-medium mb-3">Quick actions</div>
        <div className="flex flex-col gap-2">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-primary-600 text-white">
            Create Booking
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-gray-900">
            Sync Calendar
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-gray-900">
            Export CSV
          </button>
        </div>
      </div> */}
    </div>
  );
}
