import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useMediaQuery } from '@openedx/paragon';

import { useHeroCourses } from '@src/data/hero-courses/hooks';
import { HERO_CARD_COUNT, HERO_CARD_SWAP_INTERVAL_MS } from '@src/data/hero-courses/constants';
import HomeHeroCard from './HomeHeroCard';
import messages from './messages';

/**
 * The pair of floating course cards beside the hero heading.
 *
 * The two cards trade places on a timer, so whichever is in front changes every
 * few seconds.
 */
const HomeHeroCards = () => {
  const intl = useIntl();
  const { data } = useHeroCourses();
  const [isSwapped, setIsSwapped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const prefersReducedMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
  const courses = (data ?? []).slice(0, HERO_CARD_COUNT);
  // Nothing to trade places with unless both cards are there.
  const canSwap = courses.length === HERO_CARD_COUNT && !prefersReducedMotion;

  useEffect(() => {
    // Paused while a card is hovered or focused, so it doesn't swap out from
    // under someone reading it.
    if (!canSwap || isPaused) {
      return undefined;
    }

    const timer = setInterval(
      () => setIsSwapped((swapped) => !swapped),
      HERO_CARD_SWAP_INTERVAL_MS,
    );

    return () => clearInterval(timer);
  }, [canSwap, isPaused]);

  // No skeleton or error state — this is decorative, so it just stays hidden
  // when it has nothing to show.
  if (!courses.length) {
    return null;
  }

  return (
    <div
      className="home-hero__visual"
      role="group"
      aria-label={intl.formatMessage(messages.heroCourses)}
      data-testid="home-hero-cards"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Also pause on focus, for keyboard users. Bubbles from the cards inside.
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {courses.map((course, index) => (
        <HomeHeroCard
          key={course.courseId}
          course={course}
          // The first card leads until the timer flips them, and with only one
          // card it is always the one in front.
          isFront={courses.length === 1 || (index === 0) !== isSwapped}
        />
      ))}
    </div>
  );
};

export default HomeHeroCards;
