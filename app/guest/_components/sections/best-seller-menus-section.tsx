"use client";

import { Image } from "@heroui/react";
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
    <section className="min-h-screen flex flex-col justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-3xl font-semibold text-gray-900">
          Ridgeview Features
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Refined dining at Awani Hotel & Suites
        </p>
      </div>

      {/* Feature Windows */}
      <div className="max-w-6xl mx-auto space-y-16">
        {features.map((item, index) => {
          const Icon = item.icon;
          const isReverse = index % 2 !== 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div
                className={`grid md:grid-cols-2 gap-10 items-center ${
                  isReverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="w-full h-[260px] md:h-[340px] overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 max-w-md">
                  <div className="flex items-center gap-3 text-gray-900">
                    <Icon size={20} className="text-primary" />
                    <h3 className="text-xl font-medium">{item.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
