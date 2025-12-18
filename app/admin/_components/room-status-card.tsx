import { statusOptions } from "@/app/constants/rooms";
import { Card } from "@heroui/react";

export default function RoomStatusCard({ analytics }: { analytics: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {analytics?.map((item: any) => {
        const options = statusOptions.find((s) => s.uid === item.name);
        return (
          <Card
            className="p-5 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl border border-slate-200"
            key={item.name}
          >
            <div className="text-xs text-slate-500 capitalize">
              {options?.name || item.name}
            </div>
            <div className="font-semibold text-lg">{item.count}</div>
          </Card>
        );
      })}
    </div>
  );
}
