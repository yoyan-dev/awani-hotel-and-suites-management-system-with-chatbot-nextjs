"use client";

import { Image, Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function HotelPoolSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Image
            src="/pool.png"
            alt="Hotel Pool"
            className="rounded-lg w-full h-[420px] object-cover border border-gray-200 dark:border-gray-700"
          />

          {/* Floating Info */}
          <div className="absolute bottom-5 right-5 bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-200">
            Open Daily • 7:00 AM – 9:00 PM
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-primary font-medium text-xs uppercase tracking-wide">
            Relax & Refresh
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white leading-tight">
            Dive into Our Infinity Pool
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Experience the serenity of our luxurious infinity pool. Unwind, soak
            under the sun, or enjoy cocktails by the water — a perfect escape
            for every guest.
          </p>

          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <li>✔ Temperature-controlled water</li>
            <li>✔ Poolside bar & dining service</li>
            <li>✔ Lounge chairs & private cabanas</li>
            <li>✔ Lifeguard on duty</li>
          </ul>

          {/* <Button color="primary" className="px-6 py-2 rounded-md">
            Book Your Stay
          </Button> */}
        </motion.div>
      </div>
    </section>
  );
}
