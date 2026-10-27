import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

/**
 * Viewport-triggered upward reveal (480ms target duration, cubic-bezier(0.2, 0.7, 0.2, 1))
 * Triggers once per session to prevent distracting repeated animations when scrolling up/down.
 * Respects prefers-reduced-motion.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  yOffset = 20,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SwiftRollLabelProps {
  label: string;
  hoverLabel?: string;
  className?: string;
}

/**
 * Dual-layer vertical text roll interaction (200ms compositor transform)
 */
export const SwiftRollLabel: React.FC<SwiftRollLabelProps> = ({
  label,
  hoverLabel,
  className = '',
}) => {
  return (
    <span className={`swift-roll ${className}`}>
      <span className="swift-roll-primary">{label}</span>
      <span className="swift-roll-secondary" aria-hidden="true">
        {hoverLabel || label}
      </span>
    </span>
  );
};
