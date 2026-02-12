import React from "react";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

export function FunctionRoomStats({
  summary,
}: {
  summary: {
    total_rooms: number;
    available_rooms: number;
    half_occupied_rooms: number;
    full_occupied_rooms: number;
    utilization_rate: number;
    total_revenue: number;
  };
}) {
  const bookedRooms = summary.half_occupied_rooms + summary.full_occupied_rooms;

  const getPercentage = (count: number) =>
    summary.total_rooms ? (count / summary.total_rooms) * 100 : 0;

  return (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader className="pb-0">
        <p className="text-lg font-bold">Function Rooms Overview</p>
      </CardHeader>

      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Total Rooms</span>
            <span className="text-xl font-bold">{summary.total_rooms}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Booked Rooms</span>
            <span className="text-lg font-semibold text-primary">
              {bookedRooms}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Available Rooms</span>
            <span className="text-lg font-semibold text-success">
              {summary.available_rooms}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Utilization Rate</span>
            <span className="text-lg font-semibold text-danger">
              {summary.utilization_rate}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div>
              <span className="text-sm text-gray-500">Booked</span>
              <Progress
                value={getPercentage(bookedRooms)}
                color="primary"
                className="h-3 rounded-full mt-1"
              />
            </div>
            <div>
              <span className="text-sm text-gray-500">Available</span>
              <Progress
                value={getPercentage(summary.available_rooms)}
                color="success"
                className="h-3 rounded-full mt-1"
              />
            </div>
            <div>
              <span className="text-sm text-gray-500">Utilization Rate</span>
              <Progress
                value={getPercentage(summary.utilization_rate)}
                color="danger"
                className="h-3 rounded-full mt-1"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
