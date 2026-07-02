import type { SVGProps } from 'react';

/**
 * Shared defaults for this page's thin-stroke line icons (Feather Icons, at
 * stroke-width 1.8 rather than Feather's default 2) — a different visual
 * language from Paragon's own icon set, which is filled Material icons at a
 * noticeably heavier weight and would read as visibly off-style here.
 *
 * Shaped like Paragon's own icon components so a consumer can spread these
 * straight onto an <svg>, the same way <Icon src={...} /> or a Button's
 * iconBefore expects.
 */
export const lineIconDefaults: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  xmlns: 'http://www.w3.org/2000/svg',
};
