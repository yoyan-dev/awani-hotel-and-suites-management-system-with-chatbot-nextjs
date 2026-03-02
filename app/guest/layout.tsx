"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./_components/navbar";
import Chatbot from "./_components/chatbot";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f2ea] text-[#1f1e1b] font-[family-name:var(--font-guest-sans)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(176,138,83,0.26),_transparent_66%)]" />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10"
      >
        {children}
      </motion.main>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
      >
        <Chatbot />
      </motion.div>
    </div>
  );
}
