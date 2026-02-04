import { DashboardCard } from "@/components/dashboard/dashboard-layout";
import { formatPHP } from "@/lib/format-php";

export default function QuickStatsCard({ booking, functionHall }: any) {
  return (
    <DashboardCard title="Quick Stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat value={booking?.summary?.pending_bookings} label="Pending" />
        <Stat value={booking?.summary?.checked_in_today} label="Checked In" />
        <Stat
          value={functionHall?.summary?.upcoming_bookings}
          label="Upcoming Events"
        />
        <Stat
          value={formatPHP(functionHall?.summary?.total_revenue || 0)}
          label="Hall Revenue"
        />
      </div>
    </DashboardCard>
  );
}

function Stat({ value, label }: any) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-2xl font-bold">{value || 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
