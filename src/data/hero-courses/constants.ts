/**
 * The hero shows a fixed pair of floating cards.
 */
export const HERO_CARD_COUNT = 2;

/**
 * How long the front and back cards trade places, in milliseconds.
 */
export const HERO_CARD_SWAP_INTERVAL_MS = 3000;

/**
 * Avoids refetching on every window focus — the app's query defaults would
 * otherwise do that, and this data rarely changes.
 */
export const HERO_COURSES_STALE_TIME_MS = 5 * 60 * 1000;
