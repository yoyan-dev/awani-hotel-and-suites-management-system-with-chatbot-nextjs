import React from "react";

export default function Header() {
  return (
    <div className="rounded mb-4 flex items-center justify-between ">
      <div>
        <h1 className="text-2xl font-bold">Room Types Management</h1>
        <p className="text-gray-600">
          Create, edit, and organize all your hotel room categories. Set rates,
          occupancy, and amenities to keep your booking system up to date.
        </p>
      </div>
    </div>
  );
}
