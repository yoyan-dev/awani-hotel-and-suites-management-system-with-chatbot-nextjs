import React from "react";

export default function Header() {
  return (
    <div className="rounded mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Guest Feedbacks</h1>
        <p className="text-gray-600">Review submitted by hotel guest</p>
      </div>
    </div>
  );
}
