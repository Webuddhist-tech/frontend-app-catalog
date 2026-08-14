import { camelCaseObject } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

import { getHomepageCategoriesUrl } from './urls';
import type { HomepageCategory } from './types';

/**
 * Fetches the homepage course categories, each with the courses filed under it.
 */
export const fetchHomepageCategories = async (): Promise<HomepageCategory[]> => {
  // The unauthenticated client: this endpoint allows anonymous access and the
  // homepage renders for signed-out visitors, for whom the authenticated
  // client would attempt a pointless token refresh.
  const { data } = await getHttpClient().get(getHomepageCategoriesUrl());

  return camelCaseObject(Array.isArray(data) ? data : []);
};
