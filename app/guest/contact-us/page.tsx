"use client";

import { motion } from "framer-motion";
import { ContactHeader } from "./_components/contact-header";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";
import Footer from "../_components/footer";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <ContactHeader
          title="Get in Touch"
          description="Have questions or want to book a service? Reach out using the form or contact info below."
          imageUrl="/bg.png"
        />

        <div className="grid md:grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </section>
  );
}
