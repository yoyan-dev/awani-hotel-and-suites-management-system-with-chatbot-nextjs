import {
  DashboardCard,
  ProgressBar,
  Badge,
} from "@/components/dashboard/dashboard-layout";

export default function BookingStatusCard({ data }: any) {
  const distribution = data?.distributions?.by_status || {};
  const total = data?.summary?.total_bookings || 0;

  return (
    <DashboardCard title="Booking Status Overview">
      <div className="space-y-4">
        {Object.entries(distribution).map(([status, count]: any) => {
          const percentage = total ? (count / total) * 100 : 0;

          return (
            <div key={status}>
              <div className="flex justify-between mb-1">
                <Badge>{status.replace("_", " ")}</Badge>
                <span className="text-sm text-gray-500">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar value={count} max={total || 1} size="sm" />
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
