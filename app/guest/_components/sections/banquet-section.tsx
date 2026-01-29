"use client";

import React from "react";
import { Button, Image } from "@heroui/react";

const SAMPLE_IMAGES = [
  "/banquet/image-1.jpg",
  "/banquet/image-4.jpg",
  "/banquet/image-5.jpg",
  "/banquet/image-8.jpg",
];

export default function BanquetSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      {/* Hero */}
      <div
        className="h-72 md:h-96 flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/banquet/image-3.png')",
        }}
      >
        <div className="text-center px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Banquet & Function Rooms
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-200">
            Elegant venues with curated menus and professional coordination for
            weddings, corporate events, and private celebrations.
          </p>

          <div className="mt-6 flex justify-center">
            <Button color="primary" as="a" href="#packages">
              View Packages
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 items-center">
        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          <Image
            src="/banquet/image-2.jpg"
            alt="Grand Function Hall"
            className="w-full h-[360px] object-cover"
          />
        </div>

        {/* Text */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              Grand Function Hall
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              A spacious and adaptable venue designed for both intimate
              gatherings and grand occasions. Equipped with professional AV,
              elegant lighting, and a dedicated events team.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• Seating Capacity: 50–300</li>
            <li>• Flexible Layout Options</li>
            <li>• Professional AV & Lighting</li>
            <li>• Custom Catering Menus</li>
            <li>• Free Wi-Fi & Parking</li>
            <li>• Dedicated Event Coordinator</li>
          </ul>

          <div className="flex gap-3">
            <Button color="primary" as="a" href="#packages">
              See Packages
            </Button>
            <Button variant="flat" as="a" href="#gallery">
              View Gallery
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div id="gallery" className="max-w-6xl mx-auto px-6 pb-16">
        <h4 className="text-xl font-medium text-center mb-8">Event Gallery</h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SAMPLE_IMAGES.map((src, idx) => (
            <div key={idx} className="overflow-hidden rounded-md">
              <img
                src={src}
                alt={`Banquet ${idx + 1}`}
                className="w-full h-40 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h5 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            Ready to plan your event?
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Speak with our events team for custom quotes, tastings, and site
            visits.
          </p>

          <Button color="primary" as="a" href="/contact">
            Contact Events Team
          </Button>
        </div>
      </div>
    </section>
  );
}
