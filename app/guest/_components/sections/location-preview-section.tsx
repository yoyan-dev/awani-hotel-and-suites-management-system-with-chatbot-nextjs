"use client";

import { Button, Link } from "@heroui/react";
import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationPreviewSection() {
  return (
    <section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid gap-8 rounded-4xl border border-[#e2d6c5] bg-[#fffdf8] p-6 shadow-[0_24px_54px_-42px_rgba(33,28,22,0.5)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
            Prime Location
          </p>
          <h2 className="font-serif text-3xl text-[#211e1a] sm:text-4xl">
            Stay in the city center with convenient access to everything.
          </h2>
          <p className="text-sm leading-relaxed text-[#675c4f] sm:text-base">
            Awani Hotel & Suites is located at Corner-East Euzkara Avenue, San
            Carlos City, Philippines 6127. Reach business areas, local dining,
            and city landmarks within minutes.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f0e4d3] px-4 py-2 text-sm font-medium text-[#6d5534]">
            <MapPin size={16} />
            San Carlos City, Philippines
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7dccd] bg-[#f8f2e9] p-6">
          <h3 className="font-serif text-2xl text-[#26221d]">
            Plan your visit
          </h3>
          <p className="mt-2 text-sm text-[#675c4f]">
            Connect with our front office team for directions, transport
            support, and local recommendations before your arrival.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              as={Link}
              href="/guest/contact-us"
              radius="full"
              className="bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
            >
              Contact Concierge
            </Button>
            <Button
              as={Link}
              href="/guest/reservations/hotel-rooms"
              variant="bordered"
              radius="full"
              className="border-[#cfb58f] text-[#4f4436]"
              endContent={<Navigation size={16} />}
            >
              Book Your Stay
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
