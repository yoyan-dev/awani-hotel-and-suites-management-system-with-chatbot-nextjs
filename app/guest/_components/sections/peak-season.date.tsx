import { formatPHP } from "@/lib/format-php";
import { RoomType } from "@/types/room";
import { Image } from "@heroui/react";
import React from "react";

export default function PeakSeasonDate({
  rooms,
  isLoading,
}: {
  rooms: RoomType[];
  isLoading: Boolean;
}) {
  const room_types = [
    { name: "Standard" },
    { name: "Deluxe" },
    { name: "Executive Room" },
    { name: "VIP" },
    { name: "Jr Suite" },
    { name: "Family Room 7" },
    { name: "Family Room 6" },
    { name: "Two Bedroom Executive" },
  ];

  if (isLoading) return null;

  return (
    <section className="bg-white dark:bg-gray-800 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* <h2 className="text-3xl mb-6 ">Peak Season</h2>
        <p className="text-gray-600 mb-12">
          What our happy guests are saying about their stay.
        </p> */}
        <div className="flex gap-4 ">
          <div className="flex-1 text-left">
            <h2 className="text-3xl mb-6 text-center">Peak Season Dates</h2>
            {rooms.map((room) => (
              <div className="flex justify-between items-center p-4">
                <h3>{room.name}</h3> <h3>{formatPHP(3000)}</h3>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center gap-4 bg-gray-200 dark:bg-gray-900 pb-4 rounded-md">
            <Image
              alt="Awani logo"
              src="/awani-logo.png"
              width={150}
              className="bg-black p-4"
              radius="full"
            />
            <h2 className="text-3xl mb-6 text-center">
              Peak Season Rate Dates
            </h2>
            <div>
              <h3>June 29, 2025 - July 2, 2025</h3>
              <span className="text-gray-600 text-sm">Charter Day</span>
            </div>
            <div>
              <h3>June 29, 2025 - July 2, 2025</h3>
              <span className="text-gray-600 text-sm">Charter Day</span>
            </div>
            <div>
              <h3>June 29, 2025 - July 2, 2025</h3>
              <span className="text-gray-600 text-sm">Charter Day</span>
            </div>
          </div>
        </div>
        <div className="p-4 text-left space-y-4">
          <h3 className="px-2 bg-primary text-white">
            ACCOMODATIONS AND FACILITIES
          </h3>
          <p className="text-gray-800 dark:text-gray-600">
            check_in 2:00 PM ● check_out 12:00 NN ● Breakfast for (7:AM - 10:00
            AM) ● Retaurant (8:00 AM - 8:00 PM) ● Swimming Pool (7:00 AM - 9:00
            PM) ● Parking Area ● Room Service ● Air Conditioning in all rooms ●
            Coffee and Tea Facilities in VIP Suite Rooms ● Free WiFi in all
            rooms ● Lounge/Lobby ● Function Hall (200PAX maximum) ● Laundry and
            Dry Cleaning ● Wake-up Call ● 24 Hour CCTV ● 24 Hour Security Guard
            ● Airport Service
          </p>
        </div>
      </div>
    </section>
  );
}
