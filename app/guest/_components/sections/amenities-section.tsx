"use client";

import { motion } from "framer-motion";
import { Car, ConciergeBell, Dumbbell, Wifi } from "lucide-react";

const amenities = [
  {
    title: "Concierge Assistance",
    description:
      "24/7 guest support for seamless check-ins and local guidance.",
    icon: ConciergeBell,
  },
  {
    title: "High-Speed Wi-Fi",
    description:
      "Reliable premium connectivity across all rooms and common areas.",
    icon: Wifi,
  },
  {
    title: "Fitness & Wellness",
    description:
      "Daily access to wellness-focused spaces and rejuvenating amenities.",
    icon: Dumbbell,
  },
  {
    title: "Secure Parking",
    description:
      "Convenient and secure parking spaces for leisure and business guests.",
    icon: Car,
  },
];

export default function AmenitiesSection() {
  return (
    <section id="amenities" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
          Amenities
        </p>
        <h2 className="mt-3 font-serif text-3xl text-[#201e1a] sm:text-4xl">
          Premium comforts designed for modern travelers
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {amenities.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-3xl border border-[#e4d8c7] bg-[#fffdf8] p-6 shadow-[0_18px_38px_-32px_rgba(34,28,20,0.46)]"
            >
              <div className="inline-flex rounded-full bg-[#f0e3d0] p-3 text-[#9f7948]">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-[#231f1a]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#665c4e]">
                {item.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
