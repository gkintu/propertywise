"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
}

export default function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  initialScale = 0.8,
  className = ""
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ 
        scale: initialScale, 
        opacity: 0 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1 
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
