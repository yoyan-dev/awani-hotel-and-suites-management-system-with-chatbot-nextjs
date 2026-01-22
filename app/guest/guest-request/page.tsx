"use client";

import { Input, Textarea, Button, Card } from "@heroui/react";
import { ClipboardList } from "lucide-react";

export default function GuestRequestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Guest Request Form
          </h1>
          <p className="text-gray-500 mt-2">
            Submit your special requests to Awani Hotel and Suites
          </p>
        </div>

        <Card className="p-6 rounded-md shadow-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                variant="bordered"
                label="Full Name"
                labelPlacement="outside"
                id="name"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                variant="bordered"
                label="Room Number"
                labelPlacement="outside"
                id="room"
                placeholder="e.g. 101"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                variant="bordered"
                label="Request Type"
                labelPlacement="outside"
                id="type"
                placeholder="Extra Towels, Late Checkout, etc."
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Textarea
                variant="bordered"
                label="Request Details"
                labelPlacement="outside"
                id="details"
                placeholder="Write your request here..."
                required
              />
            </div>

            <Button type="submit" color="primary">
              <ClipboardList size={18} />
              Submit Request
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
