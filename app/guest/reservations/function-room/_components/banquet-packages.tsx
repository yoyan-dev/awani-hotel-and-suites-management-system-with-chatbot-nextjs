"use client";

import { formatPHP } from "@/lib/format-php";
import { BanquetPackage } from "@/types/banquet-package";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Link,
} from "@heroui/react";
import { motion } from "framer-motion";

export default function BanquetPackages({
  packages,
}: {
  packages: BanquetPackage[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card
            className="relative h-full rounded-2xl border border-white/20 
            bg-primary backdrop-blur-xl shadow-lg hover:shadow-2xl text-white"
          >
            {/* Active Badge */}
            <Chip
              size="sm"
              color={pkg.is_active ? "success" : "danger"}
              className="absolute right-4 top-4"
            >
              {pkg.is_active ? "Available" : "Unavailable"}
            </Chip>

            <CardHeader className="flex flex-col gap-2">
              <h3 className="text-xl font-bold tracking-tight">{pkg.name}</h3>

              <div className="flex flex-wrap gap-1">
                {pkg.categories.map((cat) => (
                  <Chip key={cat} size="sm" className="capitalize">
                    {cat.replace(/[-_]/g, " ")}
                  </Chip>
                ))}
              </div>
            </CardHeader>

            <CardBody className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-4xl font-extrabold">
                  {formatPHP(pkg.price_per_cover)}
                </p>
                <p className="text-sm opacity-70">per cover</p>
              </div>
            </CardBody>

            <CardFooter>
              <Button
                fullWidth
                isDisabled={!pkg.is_active}
                as={Link}
                href={`function-room/reservation/${pkg.id}`}
                className="font-semibold"
              >
                Select Package
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
