"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

// Define the props for our component. It will accept standard motion div props.
interface HoverLiftMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

// A reusable component that applies a "lift and scale" effect on hover.
export const HoverLiftMotion: React.FC<HoverLiftMotionProps> = ({
  children,
  className,
  ...props // Pass through any other motion props
}) => {
  return (
    <motion.div
      className={className}
      // The core hover animation preset
      whileHover={{ y: -1, scale: 1.01 }}
      // A nice springy transition to make it feel responsive
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
