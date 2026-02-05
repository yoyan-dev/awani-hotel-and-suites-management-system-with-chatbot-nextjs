import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Divider } from "@heroui/react";

interface RoomStatsProps {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
}

export function RoomStats({
  totalRooms,
  availableRooms,
  occupiedRooms,
  maintenanceRooms,
  occupancyRate,
}: RoomStatsProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <p className="text-lg font-bold">Rooms</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Rooms</span>
            <span className="text-xl font-semibold">{totalRooms}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Occupancy Rate</span>
            <span className="text-xl font-semibold">
              {occupancyRate.toFixed(1)}%
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
            <span className="text-sm text-gray-500">Occupied</span>
            <span className="text-lg font-medium text-primary">
              {occupiedRooms}
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
