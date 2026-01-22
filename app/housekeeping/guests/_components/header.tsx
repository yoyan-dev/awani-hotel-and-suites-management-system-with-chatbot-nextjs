import React from "react";
import Notification from "../../_components/notification";

export default function Header() {
  return (
    <div>
      {/* <Notification /> */}
      <div className="rounded mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guests Movement</h1>
        </div>
      </div>
    </div>
  );
}
