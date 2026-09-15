import { useLocation } from 'react-router';
import { Container, Alert } from '@openedx/paragon';
import { ErrorPage } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Loading, Head } from '@src/generic';
import CourseAboutIntroSlot from '@src/plugin-slots/CourseAboutIntroSlot';
import CourseAboutCourseMediaSlot from '@src/plugin-slots/CourseAboutCourseMediaSlot';
import CourseAboutOverviewSlot from '@src/plugin-slots/CourseAboutOverviewSlot';
import CourseAboutSidebarSlot from '@src/plugin-slots/CourseAboutSidebarSlot';
import { CourseShortDescription } from './course-short-description';
import { CourseDescription } from './course-description';
import { CourseRequirements } from './course-requirements';
import { LearningOutcomes } from './learning-outcomes';
import { Instructors } from './instructors';
import { useCourseAboutData } from './data/hooks';
import messages from './messages';

const CourseAboutPage = () => {
  const intl = useIntl();
  const courseId = useLocation().pathname.split('/')[2];
  const {
    data: courseAboutData,
    isLoading,
    isError,
  } = useCourseAboutData(courseId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Container fluid className="course-about-page">
        <Alert variant="danger">
          <ErrorPage
            message={intl.formatMessage(messages.errorMessage, {
              supportEmail: getConfig().INFO_EMAIL,
            })}
          />
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Head title={courseAboutData?.name || ''} />
      {/*
        A CSS grid, not Paragon's Layout: the design's sidebar is a fixed 300px,
        which Layout's proportional 12-column spans can't express. Order here is
        hero -> body -> sidebar at every width; the grid reorders the sidebar
        above the body on narrow screens visually only, so the reading order
        keeps the supplementary rail last.
      */}
      <Container fluid className="course-about-page">
        <div className="course-about-hero">
          <div className="course-about-hero__text">
            <CourseAboutIntroSlot courseAboutData={courseAboutData} />
          </div>
          {/*
            course-media-wrapper is load-bearing, not decorative: CourseMedia.scss
            hangs the image height and the centering of the video play button off it.
          */}
          <div className="course-about-hero__media course-media-wrapper">
            <CourseAboutCourseMediaSlot courseAboutData={courseAboutData} />
          </div>
        </div>
        {/*
          Two panels, matching the design: the text sections share one card
          separated by rules, and instructors get a card of their own. No Stack
          in either — the stylesheet spaces adjacent siblings, and a Stack gap
          would land on top of that. Sections render null when they have no
          content, dropping out of the sibling chain cleanly; if all four text
          sections do, the stylesheet hides the empty panel.
        */}
        <div className="course-about-body">
          <div className="course-about-body__panel">
            <CourseShortDescription shortDescription={courseAboutData.shortDescription} />
            <CourseDescription description={courseAboutData.description} />
            <CourseRequirements requirements={courseAboutData.requirements} />
            <CourseAboutOverviewSlot
              overviewData={courseAboutData.overview}
              courseId={courseId}
            />
            <LearningOutcomes learningInfo={courseAboutData.learningInfo} />
          </div>
          <Instructors instructorInfo={courseAboutData.instructorInfo} />
        </div>
        {/*
          A real element rather than the mockup's `display: contents` rail: the
          slot renders as a fragment, so a plugin inserting alongside the default
          would otherwise put each root in its own grid cell.
        */}
        <div className="course-about-rail">
          <CourseAboutSidebarSlot courseAboutData={courseAboutData} />
        </div>
      </Container>
    </>
  );
};

export default CourseAboutPage;
