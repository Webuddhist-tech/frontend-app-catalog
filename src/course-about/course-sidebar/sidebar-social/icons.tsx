/**
 * Social share icons, copied from the Course About design exactly.
 *
 * Paragon's own X/Facebook icons (BsTwitterX, BsFacebook) are a different
 * brand-icon set (Bootstrap Icons, viewBox 0 0 16 16) with different path
 * data from these — visually similar logos, but not the same artwork as the
 * design. Paragon's Email icon is a filled envelope; the design draws this
 * one as a stroke outline, matching the sidebar's other line icons instead.
 *
 * Shaped like Paragon's own icon components so they drop into
 * <Icon src={...} /> the same way: props spread onto the <svg>.
 */

import type { SVGProps } from 'react';

import { lineIconDefaults } from '../../icons';

export const XSocialIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z" />
  </svg>
);

export const FacebookSocialIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 320 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8h66z" />
  </svg>
);

export const EmailSocialIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...lineIconDefaults} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="22 6 12 13 2 6" />
  </svg>
);
