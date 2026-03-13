"use client";

import { motion } from "framer-motion";
import { Input, Textarea, Button } from "@heroui/react";

const inputClassNames = {
  label: "text-[#6b6153] font-medium",
  input: "text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] group-data-[focus=true]:border-[#b08a53]",
};

export function ContactForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-7 shadow-[0_22px_45px_-36px_rgba(31,27,20,0.48)]"
      aria-label="Contact form"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Name"
          aria-label="Name"
          variant="bordered"
          classNames={inputClassNames}
        />
        <Input
          placeholder="Email"
          aria-label="Email"
          variant="bordered"
          classNames={inputClassNames}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Phone"
          aria-label="Phone"
          variant="bordered"
          classNames={inputClassNames}
        />
        <Input
          placeholder="Subject"
          aria-label="Subject"
          variant="bordered"
          classNames={inputClassNames}
        />
      </div>

      <Textarea
        placeholder="Message"
        rows={5}
        aria-label="Message"
        variant="bordered"
        classNames={inputClassNames}
      />

      <Button className="rounded-full bg-[#b08a53] px-6 font-semibold text-white hover:bg-[#9d7948]">
        Send Message
      </Button>
    </motion.form>
  );
}
