import { useState } from "react";
import { Card, Badge, Button } from "@heroui/react";
import {
  DoorOpen,
  Users,
  CheckCircle,
  BedDouble,
  Wrench,
  Archive,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AnalyticsItem {
  name: string;
  count: number;
}

interface Props {
  analytics: AnalyticsItem[];
}

const STATUS_UI: Record<string, { color: any; icon: any }> = {
  vacant: { color: "success", icon: DoorOpen },
  occupied: { color: "warning", icon: Users },
  clean: { color: "success", icon: CheckCircle },
  dirty: { color: "danger", icon: BedDouble },
  maintenance: { color: "secondary", icon: Wrench },
  out_of_service: { color: "danger", icon: Archive },
};

export default function RoomStats({ analytics }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4 rounded-md shadow-sm flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-gray-800">Room Stats</h2>
        {isOpen ? (
          <div className="flex items-center gap-2">
            close
            <ChevronUp size={20} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            view stats
            <ChevronDown size={20} />
          </div>
        )}
      </div>

      {/* Collapsible content */}
      {isOpen && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-4 transition-all ease-in-out">
          {analytics.map((stat) => {
            const config = STATUS_UI[stat.name] || {
              color: "primary",
              icon: CheckCircle,
            };
            const Icon = config.icon;

            return (
              <Card
                key={stat.name}
                className="p-4 rounded-md shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <Badge color={config.color}>{stat.name}</Badge>
                  <Icon size={18} className="text-gray-500" />
                </div>

                <div className="text-2xl font-semibold text-gray-800">
                  {stat.count}
                </div>

                <span className="text-xs text-gray-500">Rooms</span>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
}
