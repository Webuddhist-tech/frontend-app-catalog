import { useQuery } from '@tanstack/react-query';

import { fetchHomepageAnnouncement } from './api';

/**
 * Loads the homepage announcement. A failed request leaves the banner hidden.
 */
export const useHomepageAnnouncement = () => useQuery<string | null, Error>({
  queryKey: ['homepage-announcement'],
  queryFn: fetchHomepageAnnouncement,
});
