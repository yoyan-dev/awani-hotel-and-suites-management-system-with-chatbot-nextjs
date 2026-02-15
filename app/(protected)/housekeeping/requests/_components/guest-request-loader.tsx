"use client";

import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";

export function GuestRequestLoader() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>

        <Skeleton className="h-6 w-20 rounded-full" />
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}
