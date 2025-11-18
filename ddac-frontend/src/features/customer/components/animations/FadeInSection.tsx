import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: string;
}

export default function FadeInSection({
  children,
  delay = 0,
  duration = 0.6,
  distance = 20,
  direction = "up", // "up", "down", "left", "right"
}: FadeInSectionProps) {
  // Compute offsets based on direction
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
