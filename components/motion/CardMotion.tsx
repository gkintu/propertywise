"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface CardMotionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  whileHover?: boolean;
}

export default function CardMotion({
  children,
  delay = 0,
  className = "",
  whileHover = true
}: CardMotionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 30,
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      whileHover={whileHover ? { 
        y: -2,
        transition: { duration: 0.2 }
      } : undefined}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
