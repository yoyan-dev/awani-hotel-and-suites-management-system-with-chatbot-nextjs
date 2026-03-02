"use client";

import { motion } from "framer-motion";

interface ContactHeaderProps {
  title: string;
  description?: string;
  imageUrl: string;
  eyebrow?: string;
}

export function ContactHeader({
  title,
  description,
  imageUrl,
  eyebrow = "LET'S CONNECT",
}: ContactHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-4 overflow-hidden rounded-4xl border border-[#dfd3c1]"
    >
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/58" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 space-y-3 px-6 py-24 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8c19b]">
          {eyebrow}
        </p>

        <h1 className="font-serif text-4xl text-white md:text-5xl">{title}</h1>

        {description ? (
          <p className="mx-auto max-w-2xl text-sm text-gray-200 md:text-base">
            {description}
          </p>
        ) : null}
      </motion.div>
    </motion.header>
  );
}
