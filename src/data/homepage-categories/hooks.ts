import { useQuery } from '@tanstack/react-query';

import { fetchHomepageCategories } from './api';
import { CATEGORIES_STALE_TIME_MS } from './constants';
import type { HomepageCategory } from './types';

/**
 * Loads the homepage course categories and their courses.
 */
export const useHomepageCategories = () => useQuery<HomepageCategory[], Error>({
  queryKey: ['homepageCategories'],
  queryFn: fetchHomepageCategories,
  staleTime: CATEGORIES_STALE_TIME_MS,
});
