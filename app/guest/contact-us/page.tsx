"use client";

import { motion } from "framer-motion";
import { ContactHeader } from "./_components/contact-header";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";
import Footer from "../_components/footer";

export default function ContactPage() {
  return (
    <section className="-mb-20 min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8 pb-8">
        <ContactHeader
          title="Get in Touch"
          description="Have questions or want to book a service? Reach out using the form or contact info below."
          imageUrl="/bg.png"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#fffdf8]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3729.0033255956205!2d123.40661787503784!3d10.491534589640432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a93f53650af74f%3A0xabd786cf95395353!2sMa.%20Awani%20Hotel%20%26%20Suites!5e1!3m2!1sen!2sph!4v1782660763290!5m2!1sen!2sph"
          width="600"
          height="450"
          className="block h-[360px] w-full border-0 md:h-[450px]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Ma. Awani Hotel and Suites location map"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Footer className="mt-0" />
      </motion.div>
    </section>
  );
}
