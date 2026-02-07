"use client";
import React from "react";
import { motion } from "framer-motion";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import { User } from "@/types/users";
import { supabase } from "@/lib/supabase/supabase-client";
import Chatbot from "./_components/chatbot";

export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const enhancedChildren = React.Children.map(children, (child) =>
  //   React.isValidElement(child)
  //     ? React.cloneElement(child, {
  //         user: state.user,
  //         isLoading: state.isLoading,
  //       })
  //     : child
  // );
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex gap-4 h-screen text-surface-600 bg-gray-50 dark:bg-gray-800"
      >
        <main className="w-full min-h-screen space-y-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Navbar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="dark:bg-gray-800 rounded max-h-screen overflow-y-auto"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
      >
        <Chatbot />
      </motion.div>
    </>
  );
}
