import { baseAppUrl } from '@src/utils';

/**
 * URL to fetch a course's invite-only instructions.
 */
export const getInviteInstructionsUrl = (
  courseId: string,
) => baseAppUrl(`/api/courses/${encodeURIComponent(courseId)}/invite-instructions/`);
