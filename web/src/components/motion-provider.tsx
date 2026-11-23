import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { duration, ease } from '@/lib/motion';

/** App-wide motion defaults: shared timing, and the user's reduced-motion preference honoured everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: duration.base, ease: ease.out }}>
      {children}
    </MotionConfig>
  );
}
