import { Link } from 'react-router-dom';
import {
  Card, useMediaQuery, breakpoints,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import noCourseImg from '@src/assets/images/no-course-image.svg';

import type { CourseCardProps } from './types';
import messages from './messages';
import { getFullImageUrl, getStartDateDisplay } from './utils';

export const CourseCard = ({
  isLoading,
  courseId,
  courseOrg,
  courseName,
  courseImageUrl,
  providerName,
  providerLogoUrl,
  courseStartDate,
  courseAdvertisedStart,
  showStartDate = false,
}: CourseCardProps) => {
  const intl = useIntl();
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });

  // The institution offering the course leads the card. Where that isn't known
  // — the catalog search index carries a partner logo but no partner name —
  // the course's organization stands in for it.
  const providerLabel = providerName || courseOrg;

  const startDateDisplay = showStartDate && (courseStartDate || courseAdvertisedStart)
    ? getStartDateDisplay({ start: courseStartDate, advertisedStart: courseAdvertisedStart }, intl)
    : null;

  return (
    <Card
      as={courseId ? Link : 'div'}
      to={courseId ? `/courses/${courseId}/about` : undefined}
      // TODO: Temporary use of `d-flex` to fix alignment. Remove once the related Paragon issue
      // (https://github.com/openedx/paragon/issues/3792) is resolved.
      className={`course-card d-flex ${isExtraSmall ? 'w-100' : 'course-card-desktop'}`}
      isClickable={!isLoading}
      isLoading={isLoading}
      data-testid="course-card"
    >
      <Card.ImageCap
        src={getFullImageUrl(courseImageUrl)}
        fallbackSrc={noCourseImg}
        srcAlt={courseName}
        logoSrc={providerLogoUrl ? getFullImageUrl(providerLogoUrl) : undefined}
        logoAlt={providerLabel}
        // Always reserve the badge while loading, so the skeleton keeps the
        // same shape as the card it becomes.
        logoSkeleton
        // Deliberately not lazy-loaded: Paragon keeps the image `display: none`
        // until its onLoad fires, and a hidden image never counts as near the
        // viewport, so lazy loading stalls the very event that reveals it.
        skeletonDuringImageLoad
      />
      <Card.Section className="course-card__meta">
        {providerLabel && <p className="course-card__provider">{providerLabel}</p>}
        <p className="course-card__title">{courseName}</p>
      </Card.Section>
      {startDateDisplay && (
        <Card.Footer
          textElement={intl.formatMessage(messages.startDate, { startDate: startDateDisplay })}
        />
      )}
    </Card>
  );
};
