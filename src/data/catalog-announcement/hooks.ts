import { useQuery } from '@tanstack/react-query';

import { fetchHomepageAnnouncement } from './api';
import type { HomepageAnnouncement } from './types';

/**
 * Loads the homepage announcement. A failed request leaves the banner hidden.
 */
export const useHomepageAnnouncement = () => useQuery<HomepageAnnouncement | null, Error>({
  queryKey: ['homepage-announcement'],
  queryFn: fetchHomepageAnnouncement,
});
