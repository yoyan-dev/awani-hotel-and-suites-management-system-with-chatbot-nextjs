import { Button } from "@heroui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SuccessMessage() {
  return (
    <div className="flex items-center justify-center w-full h-full ">
      <div className="flex flex-col items-center justify-center  h-full bg-white dark:bg-gray-900 p-8 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex justify-center items-center gap-2 text-success">
            Booking Successful <Check />
          </h1>
          <p className="text-gray-500 text-sm">
            Your booking has been successfully submitted. We will contact you
            shortly.
            <br />
            Thank you for choosing Awani Hotels.
            <br />
            <br />
            Best Regards,
            <br />
            Awani Hotels
            <br />
          </p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button color="primary" as={Link} href={`/guest`}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
