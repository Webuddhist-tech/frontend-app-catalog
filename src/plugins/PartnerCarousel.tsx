import {
  useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties,
} from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { usePartners } from '@src/data/partner-carousel/hooks';
import type { Partner } from '@src/data/partner-carousel/types';
import messages from './PartnerCarousel.messages';

// Styles live in the brand package: brand-openedx/paragon/_catalog.scss,
// pulled in globally via src/index.scss.

// The desktop (widest) logos-per-view count. CSS overrides the actual
// per-view count responsively (see _catalog.scss's --pc-per-view
// breakpoints); this constant only sizes the render-slot buffer, which is
// fine to size for the widest case — a buffer built for 4 still works when
// only 1 is visible, it just carries slots that go unused.
const MAX_LOGOS_PER_VIEW = 4;

// The narrowest (mobile, ≤460px) logos-per-view count from the same CSS
// breakpoints. Used as the threshold for whether to scroll at all: checking
// against MAX_LOGOS_PER_VIEW instead would decide "no scroll needed" using
// the desktop count and never revisit it, so on a narrow screen — where CSS
// shows only 1 at a time — any partner count above 1 but at or below 4 would
// overflow with no arrows to reach the rest.
const MIN_LOGOS_PER_VIEW = 1;

// One extra logo rendered off-screen on each side, so there is something to
// slide in from either direction. Never visible at rest.
const BUFFER = 1;

// Kept in sync with the CSS via the --pc-duration custom property below, so
// the two can't drift apart.
const SLIDE_MS = 400;

// Proper modulo — unlike `%`, never returns a negative result, which lets the
// window index run forever in either direction and still map onto the list.
const mod = (n: number, m: number) => ((n % m) + m) % m;

// Drop entries with no logo, and collapse duplicate logo URLs (the same image
// can be mapped to more than one organization) down to a single tile.
function usableLogos(partners: Partner[]): Partner[] {
  const seen = new Map<string, Partner>();
  partners.forEach((partner) => {
    if (partner.logo && !seen.has(partner.logo)) {
      seen.set(partner.logo, partner);
    }
  });
  return Array.from(seen.values());
}

interface ArrowProps {
  label: string;
  path: string;
  onClick: () => void;
}

const Arrow = ({ label, path, onClick }: ArrowProps) => (
  <button type="button" className="partner-carousel__arrow" aria-label={label} onClick={onClick}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <polyline points={path} />
    </svg>
  </button>
);

const TITLE_ID = 'partner-carousel-title';

const PartnerCarousel = () => {
  const intl = useIntl();
  const { data, isLoading } = usePartners();
  const partners = useMemo(() => usableLogos(data ?? []), [data]);
  // Index of the leftmost visible logo. Grows/shrinks without bound — `mod`
  // maps it back onto the list, so there is no end to run into and therefore
  // never a "jump back to the start".
  const [startIndex, setStartIndex] = useState(0);
  // -1, 0 or 1: the slide currently playing. 0 means idle.
  const [shift, setShift] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Commit the slide once it has played out. A timer (rather than
  // `transitionend`) keeps this deterministic: the listener can silently never
  // fire — if the element is hidden, for instance — which would leave the
  // carousel stuck mid-slide forever.
  useEffect(() => {
    if (shift === 0) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setStartIndex((current) => current + shift);
      setShift(0);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [shift]);

  // That commit advances the window and returns the track to its resting
  // offset in a single render. Suppress the transition for just that frame,
  // otherwise the track visibly slides back the way it came — the freshly
  // rendered window already shows exactly what the finished slide showed.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.style.transition = 'none';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    track.offsetWidth; // force a reflow so `none` applies to the change above
    track.style.transition = '';
  }, [startIndex]);

  // Handle hash scrolling on initial load. Since the title is rendered synchronously 
  // on mount (even while loading), this effect finds the element and scrolls to it 
  // before the first paint, preventing any "glitch" or flash of the top of the page.
  useLayoutEffect(() => {
    if (window.location.hash === `#${TITLE_ID}`) {
      // Use block: 'start' to respect the CSS scroll-margin-top
      document.getElementById(TITLE_ID)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  if (!isLoading && partners.length === 0) {
    return null;
  }

  // With few enough partners to fit on screen at every breakpoint there is
  // nothing to scroll, so show them as a plain row rather than repeating
  // logos to pad the track.
  const canScroll = partners.length > MIN_LOGOS_PER_VIEW;
  const windowSize = canScroll ? MAX_LOGOS_PER_VIEW + BUFFER * 2 : partners.length;
  const offsetSteps = canScroll ? BUFFER + shift : 0;

  const slots = Array.from({ length: windowSize }, (_unused, i) => {
    const index = canScroll ? startIndex - BUFFER + i : i;
    return { index, partner: partners[mod(index, partners.length)] };
  });

  const lmsBaseUrl = getConfig().LMS_BASE_URL;

  return (
    <div
      className="partner-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-labelledby={TITLE_ID}
      style={{
        // Drive sizing from CSS so no element ever needs to be measured in
        // JS. --pc-per-view is deliberately NOT set here: it needs to change
        // at the brand package's breakpoints (see _catalog.scss), and an
        // inline style always wins over a media-query-scoped rule regardless
        // of specificity, so setting it here would make it impossible for
        // CSS to ever override.
        '--pc-window': `${windowSize}`,
        '--pc-duration': `${SLIDE_MS}ms`,
      } as CSSProperties}
    >
      <p id={TITLE_ID} className="partner-carousel__title">
        {intl.formatMessage(messages.title)}
      </p>
      <div className="partner-carousel__row">
        {!isLoading && (
          <>
            {canScroll && (
              <Arrow label="Previous partners" path="15 18 9 12 15 6" onClick={() => shift === 0 && setShift(-1)} />
            )}
            <div className="partner-carousel__viewport">
              <div
                className="partner-carousel__track"
                ref={trackRef}
                style={{ transform: `translateX(calc(-100% * ${offsetSteps} / ${windowSize}))` }}
              >
                {slots.map(({ index, partner }) => {
                  const logo = (
                    <img
                      className="partner-carousel__logo"
                      src={partner.logo as string}
                      alt={partner.partnerName}
                    />
                  );

                  return partner.slug ? (
                    <a
                      key={index}
                      className="partner-carousel__item"
                      href={`${lmsBaseUrl}/schools/${partner.slug}/`}
                    >
                      {logo}
                    </a>
                  ) : (
                    <span key={index} className="partner-carousel__item">{logo}</span>
                  );
                })}
              </div>
            </div>
            {canScroll && (
              <Arrow label="Next partners" path="9 18 15 12 9 6" onClick={() => shift === 0 && setShift(1)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerCarousel;
