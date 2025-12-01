import React from "react";
import { Button, Card, CardBody, Image } from "@heroui/react";

const SAMPLE_IMAGES = [
  "/banquet/image-1.jpg",
  "/banquet/image-4.jpg",
  "/banquet/image-5.jpg",
  "/banquet/image-8.jpg",
];

export default function BanquetSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
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
            everything you need for unforgettable weddings, corporate events,
            and private celebrations.
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

      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-2">
        <Card className="shadow-lg">
          <Image
            src="/banquet/image-2.jpg"
            alt="Banquet function room"
            className="object-cover w-full h-96 rounded-lg"
          />
        </Card>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Grand Function Hall</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Spacious, flexible, and elegantly appointed — our Grand Function
              Hall adapts to your event format. From a plated wedding banquet to
              a corporate gala, we provide premium lighting, AV setup, and a
              dedicated events team.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mb-6">
              <li>
                • Seating Capacity: <strong>50–300</strong>
              </li>
              <li>• Flexible Layouts: theatre, banquet, classroom</li>
              <li>• Professional AV & Lighting</li>
              <li>• Customizable Menus & Catering</li>
              <li>• Free Wi-Fi & Onsite Parking</li>
              <li>• Dedicated Event Coordinator</li>
            </ul>
          </div>

          <div className="mt-4 flex gap-3">
            <Button color="primary" as="a" href="#packages">
              See Packages
            </Button>
            <Button as="a" href="#gallery">
              View Gallery
            </Button>
          </div>
        </div>
      </div>

      <div id="gallery" className="max-w-6xl mx-auto px-6 pb-16">
        <h4 className="text-2xl font-semibold text-center mb-6">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SAMPLE_IMAGES.map((src, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg">
              <img
                src={src}
                alt={`Banquet ${idx + 1}`}
                className="w-full h-40 object-cover transform hover:scale-105 transition"
              />
            </div>
          ))}
        </div>
      </div>

      <div id="contact" className="bg-gray-50 dark:bg-gray-800 py-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h5 className="text-xl font-semibold mb-2">
            Ready to plan your event?
          </h5>
          <p className="text-gray-600 mb-4">
            Contact our events team for custom quotes, menu tastings, and site
            tours.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button color="primary" as="a" href="/contact">
              Contact Events Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
