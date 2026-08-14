import { useQuery } from '@tanstack/react-query';

import { fetchPartners } from './api';
import { PARTNERS_STALE_TIME_MS } from './constants';
import type { Partner } from './types';

/**
 * Loads the partner logos shown on the homepage carousel.
 */
export const usePartners = () => useQuery<Partner[], Error>({
  queryKey: ['partners'],
  queryFn: fetchPartners,
  staleTime: PARTNERS_STALE_TIME_MS,
});
