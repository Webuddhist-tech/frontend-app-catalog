import { getConfig } from '@edx/frontend-platform';
import type { IntlShape } from '@edx/frontend-platform/i18n';

import { formatDate } from '@src/utils';
import type { Course } from './types';

/**
 * Constructs a full URL for an image by combining the LMS base URL with the provided image path.
 *
 * Paths that are already absolute are returned untouched — provider logos are
 * served straight from object storage, and the homepage categories endpoint
 * absolutizes its image URLs server-side.
 */
export const getFullImageUrl = (path?: string) => {
  if (!path) {
    return '';
  }
  if (/^(https?:)?\/\//i.test(path)) {
    return path;
  }
  return `${getConfig().LMS_BASE_URL}${path}`;
};

/**
 * Constructs a start date display for a course by combining the advertised start date and the start date.
 */
export const getStartDateDisplay = (
  courseData: Partial<Pick<Course['data'], 'advertisedStart' | 'start'>>,
  intl: IntlShape,
) => {
  if (courseData?.advertisedStart) {
    return courseData.advertisedStart;
  }

  if (courseData?.start) {
    return formatDate(courseData.start, intl);
  }

  return '';
};
