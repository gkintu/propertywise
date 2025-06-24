"use client";

import { motion, useAnimation } from "motion/react";
import { ReactNode, forwardRef, useImperativeHandle } from "react";

interface ShakeMotionAlternativeProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  intensity?: number;
}

export interface ShakeMotionAlternativeHandle {
  shake: () => void;
}

/**
 * Alternative implementation using Motion's useAnimation hook
 * This follows Motion's documented patterns more closely
 */
const ShakeMotionAlternative = forwardRef<ShakeMotionAlternativeHandle, ShakeMotionAlternativeProps>(({
  children,
  className = "",
  duration = 0.5,
  intensity = 5
}, ref) => {
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    shake: async () => {
      // Using Motion's animate controls following documented patterns
      await controls.start({
        x: [0, -intensity, intensity, -intensity, intensity, -intensity * 0.6, intensity * 0.6, 0],
        transition: {
          duration: duration / 1000, // Convert to seconds for Motion
          ease: "easeInOut",
          times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1] // Distribute keyframes evenly
        }
      });
    }
  }), [controls, duration, intensity]);

  return (
    <motion.div
      animate={controls}
      className={className}
      style={{ 
        willChange: 'transform',
        transformOrigin: 'center'
      }}
    >
      {children}
    </motion.div>
  );
});

ShakeMotionAlternative.displayName = 'ShakeMotionAlternative';

export default ShakeMotionAlternative;
