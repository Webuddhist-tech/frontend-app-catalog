/** Skeleton cards shown while the categories load — two rows of four. */
export const SKELETON_CARD_COUNT = 8;

/**
 * The whole catalog arrives in one response and changes rarely, so hold it
 * long enough to survive remounts and window refocus.
 */
export const CATEGORIES_STALE_TIME_MS = 5 * 60 * 1000;
