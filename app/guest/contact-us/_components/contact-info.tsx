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
      <Card className="p-6 space-y-4 border border-gray-200 shadow-sm rounded-md">
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
    <div className="flex gap-3 text-sm text-gray-600">
      <span className="text-primary mt-0.5">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
