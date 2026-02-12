import {
  DashboardCard,
  ProgressBar,
} from "@/components/dashboard/dashboard-layout";

export default function BookingSourceCard({ data }: any) {
  const sourceDistribution = data?.distributions?.by_booking_source || {};
  const totalBookings = data?.summary?.total_bookings || 0;

  return (
    <DashboardCard
      title="Booking Sources"
      subtitle="Distribution by booking channel"
    >
      <div className="space-y-4">
        {Object.entries(sourceDistribution).map(([source, count]: any) => {
          const percentage =
            totalBookings > 0 ? (Number(count) / totalBookings) * 100 : 0;

          return (
            <div key={source}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {source}
                </span>
                <span className="text-sm text-gray-500">{count}</span>
              </div>

              <ProgressBar
                value={percentage}
                color="bg-primary-500"
                size="sm"
              />
            </div>
          );
        })}

        {Object.keys(sourceDistribution).length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No source data available
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
