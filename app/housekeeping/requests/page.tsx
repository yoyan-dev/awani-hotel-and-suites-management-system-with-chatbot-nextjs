"use client";
import { GuestRequest } from "@/types/gues-request";
import { GuestRequestList } from "./_components/guest-request-list";
import PageHeader from "./_components/header";
import { useGuestRequests } from "@/hooks/use-guest-requests";
import { GuestRequestLoader } from "./_components/guest-request-loader";
import React from "react";

export default function GuestRequestsPage() {
  const { guest_requests, isLoading, fetchGuestRequests, updateGuestRequest } =
    useGuestRequests();

  React.useEffect(() => {
    fetchGuestRequests();
  }, []);

  function handleComplete(id: string) {
    updateGuestRequest({
      id: id,
      status: "completed",
    } as GuestRequest);
  }

  function handleCancel(id: string) {
    updateGuestRequest({
      id: id,
      status: "cancelled",
    } as GuestRequest);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PageHeader
        title="Guest Requests"
        subtitle="Manage housekeeping-related guest requests"
      />
      {isLoading ? (
        <GuestRequestLoader />
      ) : (
        <GuestRequestList
          requests={guest_requests}
          handleComplete={handleComplete}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
}
