import { baseAppUrl } from '@src/utils';

/**
 * URL to check whether a course is on the current user's wishlist.
 */
export const getWishlistStatusUrl = (
  courseId: string,
) => baseAppUrl(`/api/wishlist/status/?course_ids=${encodeURIComponent(courseId)}`);

/**
 * URL to add a course to the current user's wishlist.
 */
export const getWishlistListCreateUrl = () => baseAppUrl('/api/wishlist/');

/**
 * URL to remove a course from the current user's wishlist.
 */
export const getWishlistDetailUrl = (
  courseId: string,
) => baseAppUrl(`/api/wishlist/${encodeURIComponent(courseId)}/`);
