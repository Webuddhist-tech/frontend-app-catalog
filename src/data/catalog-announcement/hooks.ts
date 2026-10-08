import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@edx/frontend-platform/react';

import type { AppContextTypes } from '@src/header/types';
import { fetchHomepageAnnouncement } from './api';
import type { HomepageAnnouncement } from './types';

/**
 * Loads the homepage announcement. A failed request leaves the banner hidden.
 *
 * The username is part of the key because a signed-in response carries that
 * login's dismissal id. A fresh mount always refetches: logging out and back
 * in keeps the same username but must receive a new id.
 */
export const useHomepageAnnouncement = () => {
  const { authenticatedUser } = useContext(AppContext) as AppContextTypes;
  const isAuthenticated = Boolean(authenticatedUser);

  return useQuery<HomepageAnnouncement | null, Error>({
    queryKey: ['homepage-announcement', authenticatedUser?.username ?? null],
    queryFn: () => fetchHomepageAnnouncement(isAuthenticated),
    refetchOnMount: 'always',
  });
};
