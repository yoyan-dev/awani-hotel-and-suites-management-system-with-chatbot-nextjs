"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

interface BookingAdditionalDetailsCardProps {
  company?: string;
}

export default function BookingAdditionalDetailsCard({
  company,
}: BookingAdditionalDetailsCardProps) {
  return (
    <Card radius="none" className="mt-4">
      <CardHeader>
        <h3 className="font-semibold">Additional Details</h3>
      </CardHeader>
      <CardBody className="space-y-3">
        <div>
          <div className="text-xs text-gray-500">Company</div>
          <div className="text-sm">{company || "N/A"}</div>
        </div>
      </CardBody>
    </Card>
  );
}
