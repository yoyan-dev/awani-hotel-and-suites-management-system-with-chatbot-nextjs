import { Input } from "@heroui/react";

export default function DashboardHeader({ dateRange, setDateRange }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Front Desk Dashboard
        </h1>
        <p className="text-gray-500">Overview of your hotel operations</p>
      </div>

      <div className="flex gap-2">
        <Input
          type="date"
          label="Start Date"
          size="sm"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />
        <Input
          type="date"
          label="End Date"
          size="sm"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>
    </div>
  );
}
