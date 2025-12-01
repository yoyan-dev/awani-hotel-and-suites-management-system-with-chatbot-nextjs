import React from "react";

export default function Header() {
  return (
    <div className="rounded mb-4 ">
      <div>
        <h1 className="text-2xl font-bold">Hotel Bookings</h1>
        <p className="text-sm text-gray-600">
          View and manage room reservations, guest details, and
          check-in/check-out statuses for the hotel.
        </p>
      </div>
    </div>
  );
}
