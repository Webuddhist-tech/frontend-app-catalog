/**
 * Partner logos change rarely, so hold the fetched list long enough to
 * survive remounts and window refocus.
 */
export const PARTNERS_STALE_TIME_MS = 5 * 60 * 1000;
