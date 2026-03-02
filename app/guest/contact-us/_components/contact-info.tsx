"use client";

import { motion } from "framer-motion";
import { Card } from "@heroui/react";
import { MapPin, Mail, Phone } from "lucide-react";

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="space-y-5 rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-7 shadow-[0_22px_45px_-36px_rgba(31,27,20,0.48)]">
        <InfoRow
          icon={<MapPin size={18} />}
          text="Corner-East Euzkara Avenue, San Carlos City, Philippines 6127"
        />
        <InfoRow icon={<Mail size={18} />} text="awanihotel2019@yahoo.com" />
        <InfoRow icon={<Phone size={18} />} text="+63 917 302 4794" />
      </Card>
    </motion.div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 text-sm text-[#665c4f]">
      <span className="mt-0.5 text-[#9a7647]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
