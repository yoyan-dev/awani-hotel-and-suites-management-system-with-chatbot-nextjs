import React from "react";

export default function Header() {
  return (
    <div className="rounded mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <p className="text-gray-600">
          View, create, and manage hotel bookings. Track guest reservations,
          check-in/check-out status, and booking details efficiently.
        </p>
      </div>
    </div>
  );
}
