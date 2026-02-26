import {
  DashboardCard,
  ProgressBar,
  Badge,
} from "@/components/dashboard/dashboard-layout";

export default function RoomStatusCard({ data }: any) {
  const distribution = data?.distributions?.by_status || {};
  const totalRooms = data?.summary?.total_rooms || 0;

  return (
    <DashboardCard title="Room Status Overview">
      <div className="space-y-4">
        {Object.entries(distribution).map(([status, count]: any) => {
          const percentage = totalRooms > 0 ? (Number(count) / totalRooms) * 100 : 0;

          return (
            <div key={status}>
              <div className="flex justify-between mb-1">
                <Badge>{String(status).replace("_", " ")}</Badge>
                <span className="text-sm text-gray-500">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar value={Number(count)} max={totalRooms || 1} size="sm" />
            </div>
          );
        })}

        {Object.keys(distribution).length === 0 && (
          <p className="text-gray-500 text-center py-4">No room status data available</p>
        )}
      </div>
    </DashboardCard>
  );
}
