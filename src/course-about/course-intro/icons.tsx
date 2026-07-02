/**
 * Hero button icons (Wishlist, Buy Course), drawn as thin stroke line icons
 * (Feather Icons, at stroke-width 1.8 like the sidebar's own line icons —
 * see course-sidebar/sidebar-details/icons.tsx) rather than Paragon's own
 * icon set, which is filled Material icons at a noticeably heavier weight.
 * Using a Paragon icon here reads as visibly off-style next to everything
 * else on the page.
 *
 * Shaped like Paragon's own icon components so they drop into <Icon src={...}
 * /> or a Button's iconBefore the same way: props spread onto the <svg>.
 */

import type { SVGProps } from 'react';

import { lineIconDefaults } from '../icons';

// Feather's "heart", outline — not yet wishlisted.
export const HeartLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

// Same path, filled solid instead of stroked — already wishlisted. Red
// rather than currentColor: it should read as "wishlisted" on sight,
// regardless of whatever button colour surrounds it. Matches the brand's own
// error/danger red (see $error-text in _variables.scss) rather than an
// unrelated one-off red.
//
// Keeps the same stroke as HeartLineIcon (just in its own fill colour rather
// than none) instead of dropping it: an SVG stroke is centred on the path,
// so it extends past the path's edge on both sides — drop it and this icon's
// visible ink is a couple of px smaller all round than the outline heart's,
// even though both use the exact same path data.
//
// Plain, un-animated: this is what renders for a course that was already
// wishlisted before this page loaded (WishlistButton's initial status fetch
// resolving true). See HeartFilledPopIcon for the version that plays when a
// click just wishlisted it.
export const HeartFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...lineIconDefaults}
    fill="#8B0000"
    stroke="#8B0000"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

// Identical to HeartFilledIcon, but with the "pop" animation class. A
// separate component rather than a prop on HeartFilledIcon: this swaps in as
// a different component from the outline heart, not the same element
// changing appearance, so there's no single persistent node for a CSS
// *transition* to animate between the two states — instead, the class below
// plays a one-off "pop" the moment THIS specific component mounts. Used only
// right after a click, not for a course that loaded already-wishlisted.
export const HeartFilledPopIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...lineIconDefaults}
    fill="#8B0000"
    stroke="#8B0000"
    className="course-about-heart-pop"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

// Feather's "shopping-cart".
export const ShoppingCartLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// Feather's "play" — a plain filled triangle, no circle around it (the
// "watch intro" badge it sits in supplies its own pill background, so a
// circle here would be a redundant shape inside a shape, the same problem
// the invite-only info button had before it dropped its own border).
export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
