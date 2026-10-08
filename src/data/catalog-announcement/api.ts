import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getHttpClient } from '@edx/frontend-platform/auth';

import { getHomepageAnnouncementUrl } from './urls';
import { ANNOUNCEMENT_TONES, type AnnouncementTone, type HomepageAnnouncement } from './types';

/**
 * Fetches the notice shown above the homepage hero.
 *
 * 204 means the banner is off, outside its window, or unset. The homepage
 * renders nothing in that case.
 */
const announcementTone = (value: unknown): AnnouncementTone => (
  typeof value === 'string' && (ANNOUNCEMENT_TONES as readonly string[]).includes(value)
    ? value as AnnouncementTone
    : 'info'
);

const dismissalSessionId = (value: unknown): string | null => (
  typeof value === 'string' && value ? value : null
);

export const fetchHomepageAnnouncement = async (
  isAuthenticated: boolean,
): Promise<HomepageAnnouncement | null> => {
  // Only the authenticated client sends the login cookie. The plain client
  // stays for signed-out visitors, where that cookie is absent and the
  // authenticated client would try to refresh a token that does not exist.
  const httpClient = isAuthenticated ? getAuthenticatedHttpClient() : getHttpClient();
  const { data, status } = await httpClient.get(getHomepageAnnouncementUrl());

  if (status === 204 || data == null || data === '') {
    return null;
  }

  const body = camelCaseObject(data) as Partial<HomepageAnnouncement>;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return null;
  }

  return {
    message,
    tone: announcementTone(body.tone),
    dismissalSessionId: dismissalSessionId(body.dismissalSessionId),
  };
};
