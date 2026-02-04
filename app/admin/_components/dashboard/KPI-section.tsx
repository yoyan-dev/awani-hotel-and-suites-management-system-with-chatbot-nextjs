import { Users, DollarSign, Bed, Building2 } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import { KPICard, StatGrid } from "@/components/dashboard/dashboard-layout";

export default function KPISection({ booking, rooms, functionHall }: any) {
  return (
    <StatGrid columns={4}>
      <KPICard
        title="Total Bookings"
        value={booking?.summary?.total_bookings || 0}
        subtitle="This period"
        icon={<Users className="w-5 h-5" />}
        color="primary"
      />
      <KPICard
        title="Booking Revenue"
        value={formatPHP(booking?.summary?.total_revenue || 0)}
        icon={<DollarSign className="w-5 h-5" />}
        color="success"
      />
      <KPICard
        title="Room Occupancy"
        value={`${rooms?.summary?.occupancy_rate?.toFixed(1) || 0}%`}
        subtitle={`${rooms?.summary?.occupied_rooms || 0} occupied`}
        icon={<Bed className="w-5 h-5" />}
        color="secondary"
      />
      <KPICard
        title="Function Halls"
        value={functionHall?.summary?.total_bookings || 0}
        subtitle="Total events"
        icon={<Building2 className="w-5 h-5" />}
        color="warning"
      />
    </StatGrid>
  );
}
