import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Divider } from "@heroui/react";

interface FunctionRoomStatsProps {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  maintenanceRooms: number;
  utilizationRate: number;
}

export function FunctionRoomStats({
  totalRooms,
  availableRooms,
  bookedRooms,
  maintenanceRooms,
  utilizationRate,
}: FunctionRoomStatsProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <p className="text-lg font-bold">Function Rooms</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Rooms</span>
            <span className="text-xl font-semibold">{totalRooms}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Utilization</span>
            <span className="text-xl font-semibold">
              {utilizationRate.toFixed(1)}%
            </span>
          </div>
          <Divider className="col-span-2" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Available</span>
            <span className="text-lg font-medium text-success">
              {availableRooms}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Booked</span>
            <span className="text-lg font-medium text-primary">
              {bookedRooms}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Maintenance</span>
            <span className="text-lg font-medium text-danger">
              {maintenanceRooms}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
