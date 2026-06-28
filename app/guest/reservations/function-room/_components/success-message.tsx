import { Button } from "@heroui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SuccessMessage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-5 rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] p-8 text-center shadow-[0_30px_65px_-48px_rgba(35,29,22,0.5)] sm:p-12">
        <div className="text-center">
          <h1 className="flex items-center justify-center gap-2 font-serif text-3xl text-[#2d7a4e]">
            Reservation Successful <Check />
          </h1>
          <p className="mt-3 text-sm text-[#645b4e]">
            Your function room reservation has been submitted successfully.
            <br />
            Our events team will contact you shortly for confirmation.
            <br />
            Kindly note that this serves as a pencil booking only and is subject
            to confirmation.
            <br />
            Thank you for choosing Ma. Awani Hotel and Suites.
            <br />
            <br />
            Best Regards,
            <br />
            Ma. Awani Hotel and Suites
            <br />
          </p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            as={Link}
            href="/guest"
            className="rounded-full bg-[#b08a53] px-7 font-semibold text-white hover:bg-[#9d7948]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
