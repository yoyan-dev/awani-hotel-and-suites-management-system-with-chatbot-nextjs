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
  const [state, setState] = React.useState<{
    user: User | null;
    isLoading: boolean;
  }>({ user: null, isLoading: true });

  React.useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setState({ user: (user as User) ?? null, isLoading: false });
    }

    getCurrentUser();
  }, []);

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
        <main className="w-full min-h-screen space-y-4">
          {/* Navbar animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Navbar user={state.user} isLoading={state.isLoading} />
          </motion.div>

          {/* Children content animation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="dark:bg-gray-800 rounded"
          >
            {children}
          </motion.div>

          {/* Footer animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Footer />
          </motion.div>
        </main>
      </motion.div>

      {/* Chatbot Floating Animation */}
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
