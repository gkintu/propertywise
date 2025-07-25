"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "" 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
