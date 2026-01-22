import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type CountUpProps = {
  value: string;
  duration?: number;
};

export function CountUp({ value, duration = 2 }: CountUpProps) {
  const number = parseInt(value.replace(/[^0-9]/g, ""), 10);

  const suffix = value.replace(/[0-9]/g, "");

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, number, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [number]);

  return (
    <span>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
