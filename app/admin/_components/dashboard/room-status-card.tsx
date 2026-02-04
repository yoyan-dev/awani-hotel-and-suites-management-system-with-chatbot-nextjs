import {
  DashboardCard,
  ProgressBar,
} from "@/components/dashboard/dashboard-layout";

export default function FunctionHallEventCard({ data }: any) {
  const eventTypeDistribution = data?.distributions?.by_event_type || {};
  const totalBookings = data?.summary?.total_bookings || 0;

  return (
    <DashboardCard
      title="Function Hall Events"
      subtitle="Distribution by event type"
    >
      <div className="space-y-4">
        {Object.entries(eventTypeDistribution).map(([type, count]: any) => {
          const percentage =
            totalBookings > 0 ? (Number(count) / totalBookings) * 100 : 0;

          return (
            <div key={type}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {type}
                </span>
                <span className="text-sm text-gray-500">{count}</span>
              </div>

              <ProgressBar
                value={percentage}
                color="bg-secondary-500"
                size="sm"
              />
            </div>
          );
        })}

        {Object.keys(eventTypeDistribution).length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No event type data available
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
