import { getConfig } from '@edx/frontend-platform';

/**
 * URL to fetch a course's invite-only instructions.
 */
export const getInviteInstructionsUrl = (
  courseId: string,
) => `${getConfig().LMS_BASE_URL}/api/courses/${encodeURIComponent(courseId)}/invite-instructions/`;
