import React from "react";
import { Card, CardBody } from "@heroui/react";

export default function successScreen() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border border-gray-200 shadow-sm rounded-lg">
        <CardBody className="p-10 text-center space-y-4">
          <div className="text-5xl animate-pulse">✔</div>
          <h2 className="text-xl font-semibold text-gray-900">Thank You!</h2>
          <p className="text-sm text-gray-500">
            We appreciate your feedback and look forward to welcoming you again.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
