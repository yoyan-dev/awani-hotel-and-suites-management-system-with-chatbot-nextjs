import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { CountUp } from "../count-up";

const stats = [
  { value: "98%", label: "Positive Feedback" },
  { value: "15+", label: "Years of Expertise" },
  { value: "25k+", label: "Happy Clients" },
];

export default function Stats() {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <Card
              className="
                bg-white/80 dark:bg-gray-900/70 
                backdrop-blur-xl shadow-lg
                hover:shadow-2xl transition-all
                hover:-translate-y-1 cursor-default
                border border-white/20 dark:border-gray-700
                rounded-2xl
              "
            >
              <CardBody className="text-center py-10">
                <p className="text-4xl font-extrabold text-primary">
                  <CountUp value={s.value} />
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm tracking-wide">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
