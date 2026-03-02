"use client";
import React from "react";
import Header from "./_components/header";
import { Button } from "@heroui/button";
import CustomRequestModal from "./_components/modals/custom-request-modal";

export default function Booking() {
  const [isHousekeepingRequest, setIsHousekeepingRequest] =
    React.useState(false);
  return (
    <div className="min-h-screen py-8">
      <section className="rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] p-6 shadow-[0_28px_60px_-45px_rgba(35,29,22,0.5)] sm:p-8">
        <Header />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="rounded-full bg-[#b08a53] px-6 font-semibold text-white hover:bg-[#9d7948]">
            Extend Stay
          </Button>
          <Button
            onPress={() => setIsHousekeepingRequest(true)}
            variant="bordered"
            className="rounded-full border-[#ceb58f] bg-[#fff8ee] px-6 text-[#4f4335]"
          >
            {isHousekeepingRequest ? "Request Sent" : "Request Housekeeping"}
          </Button>
          <CustomRequestModal />
        </div>
      </section>
    </div>
  );
}
