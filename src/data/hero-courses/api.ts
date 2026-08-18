import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getHttpClient } from '@edx/frontend-platform/auth';

import { getHeroCoursesUrl } from './urls';
import type { HeroCourse } from './types';

/**
 * Fetches the courses for the homepage hero cards.
 *
 * The client depends on sign-in state: the authenticated client is the only
 * one that sends cookies, but it rejects the request outright when there's no
 * token, so it can't be used for signed-out visitors.
 */
export const fetchHeroCourses = async (isAuthenticated: boolean): Promise<HeroCourse[]> => {
  const httpClient = isAuthenticated ? getAuthenticatedHttpClient() : getHttpClient();
  const { data } = await httpClient.get(getHeroCoursesUrl());

  return camelCaseObject(Array.isArray(data) ? data : []);
};
