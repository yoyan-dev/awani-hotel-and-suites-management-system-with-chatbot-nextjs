import React from "react";
import { Button } from "@heroui/button";

export default function header() {
  return (
    <div
      className="h-72 md:h-96 flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(12,12,12,0.45), rgba(12,12,12,0.45)), url('/banquet/image-3.jpg')",
      }}
      aria-hidden={false}
    >
      <div className="text-center px-6">
        <h2 className="text-3xl md:text-4xl  text-white font-semibold">
          Banquet Packages & Function Rooms
        </h2>
        <p className="mt-2 text-gray-200 max-w-2xl mx-auto">
          Elegant spaces, curated menus, and professional event coordination —
          everything you need for unforgettable weddings, corporate events, and
          private celebrations.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button color="primary" as="a" href="#packages">
            View Packages
          </Button>
          <Button as="a" href="#contact">
            Contact Coordinator
          </Button>
        </div>
      </div>
    </div>
  );
}
