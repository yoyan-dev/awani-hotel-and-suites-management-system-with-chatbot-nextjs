"use client";

import { Card, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { Utensils, Leaf, Wine, Users } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Signature Dishes",
    description:
      "House specialties crafted by our chefs using carefully selected ingredients for a refined dining experience.",
    icon: Utensils,
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  },
  {
    id: 2,
    title: "Local & Organic Choices",
    description:
      "Fresh local produce and organic selections highlighting authentic regional flavors.",
    icon: Leaf,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  },
  {
    id: 3,
    title: "Premium Beverages",
    description:
      "Curated wines, juices, and refreshments perfectly paired with every meal.",
    icon: Wine,
    image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg",
  },
  {
    id: 4,
    title: "Group & Family Dining",
    description:
      "Comfortable spaces designed for families, groups, and shared dining moments.",
    icon: Users,
    image: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
  },
];

export default function RestaurantFeaturesWindow() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 pt-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-primary">
          Ridgeview Features
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Experience refined dining at Awani Hotel & Suites
        </p>
      </div>

      {/* Windows */}
      <div className="max-w-7xl mx-auto space-y-10">
        {features.map((item, index) => {
          const Icon = item.icon;
          const isReverse = index % 2 !== 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isReverse ? 80 : -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Card
                className={`grid md:grid-cols-2 gap-8 p-6 md:p-10 rounded-xl shadow-sm items-center ${
                  isReverse ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Left Window (Image) */}
                <div className="w-full h-[260px] md:h-[360px] overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Window (Content) */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-md bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
