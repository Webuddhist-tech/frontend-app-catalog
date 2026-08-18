import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@edx/frontend-platform/react';

import type { AppContextTypes } from '@src/header/types';
import { fetchHeroCourses } from './api';
import { HERO_COURSES_STALE_TIME_MS } from './constants';
import type { HeroCourse } from './types';

/**
 * Loads the courses for the homepage hero cards.
 *
 * Reads the user from context, not `getAuthenticatedUser()`, so the hook
 * re-renders once the user resolves instead of staying on a stale response.
 */
export const useHeroCourses = () => {
  const { authenticatedUser } = useContext(AppContext) as AppContextTypes;
  const isAuthenticated = Boolean(authenticatedUser);

  return useQuery<HeroCourse[], Error>({
    // Username in the key: the response is per-user, so a shared key would
    // leak a cached response across sign-in state or between users.
    queryKey: ['heroCourses', authenticatedUser?.username ?? null],
    queryFn: () => fetchHeroCourses(isAuthenticated),
    staleTime: HERO_COURSES_STALE_TIME_MS,
  });
};
