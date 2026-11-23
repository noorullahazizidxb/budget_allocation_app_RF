import type { Variant, Variants } from 'framer-motion';
import { fadeUp, listItem, settle, stagger } from './motion';

/** Properties the compositor can animate without triggering layout (keeps CLS at zero). */
const COMPOSITED = new Set(['opacity', 'x', 'y', 'scale', 'scaleX', 'scaleY', 'transition']);

const animatedKeys = (variants: Variants) =>
  Object.values(variants).flatMap((v: Variant) => (typeof v === 'function' ? [] : Object.keys(v)));

describe('motion tokens', () => {
  it.each([
    ['fadeUp', fadeUp],
    ['settle', settle],
    ['listItem', listItem],
    ['stagger', stagger()],
  ])('%s only animates transform and opacity', (_, variants) => {
    for (const key of animatedKeys(variants)) expect(COMPOSITED).toContain(key);
  });

  it('settle never hides content, so headings paint on the first frame', () => {
    expect(settle.hidden).not.toHaveProperty('opacity');
  });
});
