import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Divider } from "@heroui/react";

interface FunctionHallStatsProps {
  totalBookings: number;
  totalRevenue: number;
  upcomingBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalGuests: number;
}

export function FunctionHallStats({
  totalBookings,
  totalRevenue,
  upcomingBookings,
  pendingBookings,
  completedBookings,
  totalGuests,
}: FunctionHallStatsProps) {
  return (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader className="pb-0">
        <p className="text-lg font-bold">Function Hall Bookings</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Bookings</span>
            <span className="text-xl font-semibold">{totalBookings}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <span className="text-xl font-semibold">
              ₱{totalRevenue.toLocaleString()}
            </span>
          </div>
          <Divider className="col-span-2" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Upcoming</span>
            <span className="text-lg font-medium text-primary">
              {upcomingBookings}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Pending</span>
            <span className="text-lg font-medium text-warning">
              {pendingBookings}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Completed</span>
            <span className="text-lg font-medium text-success">
              {completedBookings}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Guests</span>
            <span className="text-lg font-medium">
              {totalGuests.toLocaleString()}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
