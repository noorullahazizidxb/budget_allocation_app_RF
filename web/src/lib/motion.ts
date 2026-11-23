import type { Transition, Variants } from 'framer-motion';

/**
 * Motion tokens shared by every animated component. Only transform and opacity
 * are animated so entrances never shift layout; `MotionProvider` turns transform
 * and layout animations off for users who prefer reduced motion.
 */
export const duration = { fast: 0.16, base: 0.28, slow: 0.45 } as const;

export const ease = {
  /** Decelerating curve for things entering the screen. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric curve for things moving between two on-screen states. */
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, Transition['ease']>;

export const spring = {
  /** Snappy, barely-bouncing spring for press/hover feedback and layout moves. */
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 },
} as const satisfies Record<string, Transition>;

const enter: Transition = { duration: duration.base, ease: ease.out };

/** Fade in with a short rise; the default entrance for blocks and list items. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: enter },
};

/**
 * Transform-only entrance for blocks holding a page's main heading: the text is
 * painted on the first frame (no opacity hide), so LCP is never delayed.
 */
export const settle: Variants = {
  hidden: { y: 8 },
  visible: { y: 0, transition: enter },
};

/** Parent that reveals its `fadeUp` children one after another. */
export const stagger = (step = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren } },
});

/** Scroll-triggered reveal props: animate once, slightly before the block is fully in view. */
export const revealOnScroll = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px 0px -64px 0px' },
} as const;

/** Mount-time reveal props for content that is already on screen when the page opens. */
export const revealOnMount = { initial: 'hidden', animate: 'visible' } as const;

/** Rows that join or leave a list: they pop in place while siblings glide via `layout`. */
export const listItem: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: enter },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: ease.inOut } },
};

/** Lift-on-hover / press-in feedback for interactive cards and tiles. */
export const pressable = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: spring.snappy,
} as const;
