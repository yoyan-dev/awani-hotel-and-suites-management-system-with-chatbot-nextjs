"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-12 max-w-3xl mx-auto text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-gray-600"
      >
        Since 2019, we’ve been helping travelers find stays they love —
        effortlessly. Our passion lies in curating unforgettable journeys by
        blending seamless technology with a love for discovery.
      </motion.p>
    </section>
  );
}
