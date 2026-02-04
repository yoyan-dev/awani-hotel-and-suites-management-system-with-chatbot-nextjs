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
  eyebrow = "LET’S CONNECT",
}: ContactHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-md"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 px-6 py-24 text-center space-y-3"
      >
        <p className="text-xs font-medium tracking-wide uppercase text-primary">
          {eyebrow}
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          {title}
        </h1>

        {description && (
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </motion.div>
    </motion.header>
  );
}
