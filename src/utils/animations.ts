import type { Variants } from "framer-motion";

/**
 * Standard staggered container for lists.
 * It coordinates the entrance of all children.
 */
export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Time between each child's animation
    },
  },
};

/**
 * Standard fade-up animation for individual items.
 * Works best when children are inside a STAGGER_CONTAINER.
 */
export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
    } as const,
  },
};

/**
 * Standard hover and tap effects for interactive elements like cards.
 */
export const HOVER_BOUNCE = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring", damping: 10, stiffness: 400 } as const,
  },
  whileTap: { scale: 0.98 },
};
