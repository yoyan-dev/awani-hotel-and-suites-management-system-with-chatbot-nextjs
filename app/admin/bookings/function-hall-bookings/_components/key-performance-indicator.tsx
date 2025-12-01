import { formatPHP } from "@/lib/format-php";
import { Calendar, DollarSign, Users } from "lucide-react";
import React from "react";

export default function KeyPerformanceIndicator({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <DollarSign />
        </div>
        <div>
          <div className="text-sm text-slate-500">Revenue</div>
          <div className="text-lg font-semibold">
            {formatPHP(stats.totalRevenue)}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <Calendar />
        </div>
        <div>
          <div className="text-sm text-slate-500">Upcoming Bookings</div>
          <div className="text-lg font-semibold">{stats.upcoming}</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
          <Users />
        </div>
        <div>
          <div className="text-sm text-slate-500">Currently Occupied</div>
          <div className="text-lg font-semibold">{stats.occupied}</div>
        </div>
      </div>
    </div>
  );
}
