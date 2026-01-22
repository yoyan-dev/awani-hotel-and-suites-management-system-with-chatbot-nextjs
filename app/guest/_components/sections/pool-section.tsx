"use client";

import { Card, CardBody, Image, Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function HotelPoolSection() {
  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Image
            src="/pool.png"
            alt="Hotel Pool"
            className="
              rounded-3xl shadow-xl w-full h-[420px] object-cover 
              border border-white/30 dark:border-gray-800
            "
          />

          {/* Floating Info Card */}
          <div
            className="
              absolute bottom-5 right-5 
              bg-white/70 dark:bg-gray-900/70
              backdrop-blur-xl 
              px-5 py-3 rounded-xl shadow-lg
              border border-white/20 dark:border-gray-700
            "
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Open Daily • 7:00 AM – 9:00 PM
            </p>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-semibold text-xs uppercase tracking-wider">
            Relax & Refresh
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-4 leading-tight">
            Dive into Our Infinity Pool
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
            Experience the serenity of our luxurious infinity pool. Whether
            you're looking to unwind, soak under the sun, or sip cocktails by
            the water, our poolside area offers the perfect escape for every
            guest.
          </p>

          <ul className="space-y-3 mb-8 text-gray-700 dark:text-gray-300 text-base">
            <li className="flex items-center gap-2">
              ✔ Temperature-controlled water
            </li>
            <li className="flex items-center gap-2">
              ✔ Poolside bar & dining service
            </li>
            <li className="flex items-center gap-2">
              ✔ Lounge chairs & private cabanas
            </li>
            <li className="flex items-center gap-2">✔ Lifeguard on duty</li>
          </ul>

          <Button
            color="primary"
            size="lg"
            radius="full"
            className="shadow-md hover:shadow-xl transition-all"
          >
            Book Your Stay
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
