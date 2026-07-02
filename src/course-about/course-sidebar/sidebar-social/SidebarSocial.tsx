import { useMemo } from 'react';
import { Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import type { CourseAboutData } from '@src/course-about/types';
import CourseAboutSidebarSocialSlot from '@src/plugin-slots/CourseAboutSidebarSocialSlot';
import { getSocialLinks } from './utils';

const SidebarSocial = ({ courseAboutData }: { courseAboutData: CourseAboutData }) => {
  const intl = useIntl();

  const socialLinks = useMemo(
    () => getSocialLinks(intl).map((link) => ({
      ...link,
      destination: link.destination(courseAboutData),
    })),
    [courseAboutData, intl],
  );

  // Each button carries its own tooltip now (see SocialLinks), naming the
  // platform it shares to, rather than one generic tooltip for the whole row.
  return (
    <header>
      <CourseAboutSidebarSocialSlot socialLinks={socialLinks} />
      <Card.Divider />
    </header>
  );
};

export default SidebarSocial;
