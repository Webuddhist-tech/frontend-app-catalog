import { camelCaseObject } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

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

export const fetchHomepageAnnouncement = async (): Promise<HomepageAnnouncement | null> => {
  // The unauthenticated client: this endpoint allows anonymous access and the
  // homepage renders for signed-out visitors, for whom the authenticated
  // client would attempt a pointless token refresh.
  const { data, status } = await getHttpClient().get(getHomepageAnnouncementUrl());

  if (status === 204 || data == null || data === '') {
    return null;
  }

  const body = camelCaseObject(data) as Partial<HomepageAnnouncement>;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return null;
  }

  return { message, tone: announcementTone(body.tone) };
};
