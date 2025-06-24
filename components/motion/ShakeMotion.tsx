"use client";

import { motion } from "motion/react";
import { ReactNode, forwardRef, useImperativeHandle, useRef } from "react";

interface ShakeMotionProps {
  children: ReactNode;
  className?: string;
  /**
   * Duration of shake animation in milliseconds
   * @default 500
   */
  duration?: number;
  /**
   * Intensity of shake animation (px)
   * @default 5
   */
  intensity?: number;
}

export interface ShakeMotionHandle {
  shake: () => void;
}

const ShakeMotion = forwardRef<ShakeMotionHandle, ShakeMotionProps>(({
  children,
  className = "",
  duration = 500,
  intensity = 5
}, ref) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useImperativeHandle(ref, () => ({
    shake: () => {
      if (motionRef.current && !isAnimating.current) {
        isAnimating.current = true;
        
        // Use framer-motion's animate function for better integration
        // Following Motion's documented pattern for programmatic animations
        const keyframes = [
          { x: 0 },
          { x: -intensity },
          { x: intensity },
          { x: -intensity },
          { x: intensity },
          { x: -intensity * 0.6 },
          { x: intensity * 0.6 },
          { x: 0 }
        ];

        // Using Web Animations API as documented in Motion docs
        const animation = motionRef.current.animate(
          keyframes.map(frame => ({ transform: `translateX(${frame.x}px)` })),
          {
            duration,
            easing: 'ease-in-out'
          }
        );

        // Reset animation flag when complete
        animation.addEventListener('finish', () => {
          isAnimating.current = false;
        });

        // Handle animation cancellation
        animation.addEventListener('cancel', () => {
          isAnimating.current = false;
        });
      }
    }
  }), [duration, intensity]);

  return (
    <motion.div
      ref={motionRef}
      className={className}
      // Following Motion's performance best practices
      style={{ 
        willChange: 'transform',
        // Ensure proper transform origin for shake effect
        transformOrigin: 'center'
      }}
    >
      {children}
    </motion.div>
  );
});

ShakeMotion.displayName = 'ShakeMotion';

export default ShakeMotion;
