import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getInviteInstructionsUrl } from './urls';

/**
 * Fetches a course's invite-only instructions, set per-partner in Django
 * admin. Null when the course has no partner or the partner hasn't set any.
 * @async
 */
export const getInviteInstructions = async (courseId: string): Promise<string | null> => {
  const { data } = await getAuthenticatedHttpClient().get(getInviteInstructionsUrl(courseId));
  return data.invite_instructions;
};
