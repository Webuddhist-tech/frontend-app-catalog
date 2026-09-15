import {
  Stack, Container, Icon,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';

import CourseAboutSidebarCoursePriceSlot from '@src/plugin-slots/CourseAboutSidebarCoursePriceSlot';
import { ROUTES } from '@src/routes';
import type { CourseAboutData } from '../../types';
import { hasVisibleHtmlContent } from '../../utils';
import { StudioLink } from '../../studio-link';
import SidebarDetailsItem from './SidebarDetailsItem';
import { getSidebarDetails } from './utils';
import { CheckSquareLineIcon } from './icons';
import messages from './messages';

const SidebarDetails = ({ courseAboutData }: { courseAboutData: CourseAboutData }) => {
  const intl = useIntl();

  const renderPrerequisites = () => {
    if (!courseAboutData.preRequisiteCourses?.length) {
      return null;
    }

    const prerequisite = courseAboutData.preRequisiteCourses[0];
    const prerequisiteUrl = ROUTES.COURSE_ABOUT.replace(':courseId', prerequisite.key);

    // Not a SidebarDetailsItem: that component pairs a short label with a
    // short value on one line, and a course title is neither — it forced the
    // title onto its own overflowing line with no room to breathe. This is
    // its own block instead: a label row, the course link, then the
    // completion sentence below, the way a course fact with this much to say
    // needs more layout than a single label/value row can give it. No
    // trailing Card.Divider — see SidebarDetailsItem for why.
    return (
      <div className="course-about-sidebar-prerequisite">
        <span className="course-about-sidebar-prerequisite__label">
          <Icon src={CheckSquareLineIcon} />
          {intl.formatMessage(messages.prerequisites)}
        </span>
        <Link to={prerequisiteUrl} className="course-about-sidebar-prerequisite__course">
          {prerequisite.display}
        </Link>
        <p className="course-about-sidebar-prerequisite__completion">
          {intl.formatMessage(messages.prerequisitesCompletion, {
            prerequisite: <Link to={prerequisiteUrl}>{prerequisite.display}</Link>,
          })}
        </p>
      </div>
    );
  };

  const renderAboutSidebarHtml = () => {
    if (!hasVisibleHtmlContent(courseAboutData.aboutSidebarHtml)) {
      return null;
    }

    return (
      <Container className="course-about-sidebar-html p-3">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: courseAboutData.aboutSidebarHtml as string }} />
      </Container>
    );
  };

  return (
    <Stack>
      {getSidebarDetails(intl, courseAboutData)
        .filter(detail => detail.show)
        .map(detail => (
          <SidebarDetailsItem
            key={detail.key}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
          />
        ))}
      {courseAboutData.coursePrice && (
        <CourseAboutSidebarCoursePriceSlot coursePrice={courseAboutData.coursePrice} />
      )}
      {renderPrerequisites()}
      {renderAboutSidebarHtml()}
      {/*
        Below everything else in the sidebar rather than tied to any one
        content section (see studio-link/index.tsx) — the sidebar always
        renders regardless of which sections above have content, so this
        never ends up as an orphaned button with nothing else around it. No
        wrapping Container here: StudioLink renders null for a non-staff
        visitor, and a Container around it would still render its own empty
        padded box even when its child renders nothing.
      */}
      <StudioLink courseId={courseAboutData.id} />
    </Stack>
  );
};

export default SidebarDetails;
