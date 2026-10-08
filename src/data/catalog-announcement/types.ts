export const ANNOUNCEMENT_TONES = ['info', 'success', 'warning', 'alert'] as const;

export type AnnouncementTone = typeof ANNOUNCEMENT_TONES[number];

export interface HomepageAnnouncement {
  message: string;
  tone: AnnouncementTone;
}
