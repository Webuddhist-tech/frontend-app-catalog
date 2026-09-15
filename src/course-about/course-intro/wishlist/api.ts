import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  getWishlistStatusUrl, getWishlistListCreateUrl, getWishlistDetailUrl,
} from './urls';

/**
 * Checks whether a single course is on the current user's wishlist.
 * @async
 */
export const getWishlistStatus = async (courseId: string): Promise<boolean> => {
  const { data } = await getAuthenticatedHttpClient().get(getWishlistStatusUrl(courseId));
  return Boolean(data[courseId]);
};

/**
 * Adds a course to the current user's wishlist.
 * @async
 */
export const addToWishlist = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient().post(getWishlistListCreateUrl(), { course_id: courseId });
  return data;
};

/**
 * Removes a course from the current user's wishlist.
 * @async
 */
export const removeFromWishlist = async (courseId: string) => {
  await getAuthenticatedHttpClient().delete(getWishlistDetailUrl(courseId));
};
