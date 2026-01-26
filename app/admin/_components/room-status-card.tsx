import { statusOptions } from "@/app/constants/rooms";

export default function RoomStats({ analytics }: { analytics: any }) {
  return (
    <div className="flex gap-4 flex-wrap px-2 pb-4">
      {analytics.map((item: any) => {
        const options = statusOptions.find((s) => s.uid === item.name);
        return (
          <div
            className="flex-1 p-3 rounded-lg bg-slate-50 dark:bg-gray-900 border border-default-400"
            key={item.name}
          >
            <div className="text-xs text-slate-500 capitalize">
              {options?.name || item.name}
            </div>
            <div className="font-semibold text-lg">{item.count}</div>
          </div>
        );
      })}
    </div>
  );
}
