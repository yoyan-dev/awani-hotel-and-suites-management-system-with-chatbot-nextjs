"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { GuestRequestStatusChip } from "./guest-request-status-chip";
import { GuestRequest } from "@/types/gues-request";

interface Props {
  request: GuestRequest;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function GuestRequestCard({ request, onComplete, onCancel }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex justify-between">
        <div>
          <p className="font-medium">Room {request.room_number}</p>
          <p className="text-sm text-gray-500">{request.fullname}</p>
        </div>

        <GuestRequestStatusChip status={request.status} />
      </CardHeader>

      <CardBody className="space-y-4">
        <div>
          <p className="text-xs text-gray-500">Request Type</p>
          <p className="font-medium">{request.request_type}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Details</p>
          <p className="text-sm">{request.request_details}</p>
        </div>

        {request.status === "pending" && (
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="flat" color="danger" onPress={onCancel}>
              Cancel
            </Button>

            <Button size="sm" color="primary" onPress={onComplete}>
              Mark as Completed
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
