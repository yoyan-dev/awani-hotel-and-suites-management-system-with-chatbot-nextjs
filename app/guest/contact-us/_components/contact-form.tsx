"use client";

import { motion } from "framer-motion";
import { Input, Textarea, Button } from "@heroui/react";

export function ContactForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
      aria-label="Contact form"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Name" aria-label="Name" />
        <Input placeholder="Email" aria-label="Email" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Phone" aria-label="Phone" />
        <Input placeholder="Subject" aria-label="Subject" />
      </div>

      <Textarea placeholder="Message" rows={5} aria-label="Message" />

      <Button color="primary" className="rounded-md px-6">
        Send Message
      </Button>
    </motion.form>
  );
}
