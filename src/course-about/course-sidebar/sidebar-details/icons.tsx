/**
 * Sidebar row icons, matching the Course About design exactly.
 *
 * The design draws these as thin-stroke line icons (Feather Icons, at
 * stroke-width 1.8 rather than Feather's default 2) — a different visual
 * language from Paragon's own icon set, which is filled Material icons. Using
 * a Paragon icon here, even one with similar meaning, reads as visibly
 * off-style next to everything else on the page, so these are copied from the
 * design's own markup instead.
 *
 * "Estimated effort" and "Prerequisites" have no icon in the design at all
 * (neither row appears in any of the four mockups) — TrendingUp and
 * CheckSquare are both real Feather icons at the same weight, chosen to read
 * as part of the same set rather than inventing a new visual style for just
 * these two. Price doesn't reuse the design's own dollar-sign glyph either, by
 * choice: "tag" reads more like a price generally, and less like a
 * specifically non-free one.
 *
 * Shaped like Paragon's own icon components (see @openedx/paragon/icons) so
 * they drop into <Icon src={...} /> the same way: props spread onto the
 * <svg>, stroke set to currentColor so `.pgn__icon`'s `color` still governs
 * it exactly as it does Paragon's fill="currentColor" icons.
 */

import type { SVGProps } from 'react';

import { lineIconDefaults } from '../../icons';

export const FlagLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <path d="M4 21V4h9l1 2h6v10h-7l-1-2H4" />
  </svg>
);

export const ArchiveLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11h14V8" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export const ClockLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const UsersLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Not the design's own icon (see file docblock) — Feather's "tag".
export const TagLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

// Not in the design (see file docblock) — Feather's "trending-up", same weight.
export const TrendingUpLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// Not in the design (see file docblock) — Feather's "check-square" icon, same weight.
export const CheckSquareLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
