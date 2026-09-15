import { getHttpClient } from '@edx/frontend-platform/auth';

import { getInviteInstructionsUrl } from './urls';

/**
 * Fetches a course's invite-only instructions, set per-partner in Django
 * admin. Null when the course has no partner or the partner hasn't set any.
 *
 * getHttpClient(), not getAuthenticatedHttpClient(): the endpoint is public
 * (an invite-only course's visitor may well be signed out), matching the
 * convention this app's other public data fetches already use (see
 * data/partner-carousel/api.ts, data/homepage-categories/api.ts).
 * @async
 */
export const getInviteInstructions = async (courseId: string): Promise<string | null> => {
  const { data } = await getHttpClient().get(getInviteInstructionsUrl(courseId));
  return data.invite_instructions;
};
