import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export function RoomStats({
  summary,
}: {
  summary: {
    total_rooms: number;
    vacant_rooms: number;
    vacant_dirty_rooms: number;
    dirty_rooms: number;
    occupied_rooms: number;
    maintenance_rooms: number;
    out_of_service_rooms: number;
    stock_rooms: number;
    occupancy_rate: number;
  };
}) {
  return (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader className="pb-0">
        <p className="text-lg font-bold">Rooms</p>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Top Summary */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Rooms</span>
            <span className="text-xl font-semibold">{summary.total_rooms}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Occupancy Rate</span>
            <span className="text-xl font-semibold">
              {summary.occupancy_rate.toFixed(1)}%
            </span>
          </div>

          <Divider className="col-span-2" />

          {/* Status Breakdown */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Vacant</span>
            <span className="text-lg font-medium text-success">
              {summary.vacant_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Vacant Dirty</span>
            <span className="text-lg font-medium text-warning">
              {summary.vacant_dirty_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Dirty</span>
            <span className="text-lg font-medium text-yellow-600">
              {summary.dirty_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Occupied</span>
            <span className="text-lg font-medium text-primary">
              {summary.occupied_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Maintenance</span>
            <span className="text-lg font-medium text-danger">
              {summary.maintenance_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Out of Service</span>
            <span className="text-lg font-medium text-red-600">
              {summary.out_of_service_rooms}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Stock Room</span>
            <span className="text-lg font-medium text-gray-500">
              {summary.stock_rooms}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
