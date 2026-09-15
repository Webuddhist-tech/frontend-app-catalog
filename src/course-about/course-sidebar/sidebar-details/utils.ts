import { IntlShape } from '@edx/frontend-platform/i18n';

import { formatDate } from '@src/utils';
import { SIDEBAR_DETAIL_KEYS } from './constants';
import type { CourseAboutData } from '../../types';
import messages from './messages';
import {
  FlagLineIcon,
  ArchiveLineIcon,
  ClockLineIcon,
  UsersLineIcon,
  TrendingUpLineIcon,
} from './icons';

/**
 * Format the course's effort value as "N hours per week", matching Studio's
 * own "Hours of effort per week" field. Falls back to the raw value for
 * courses set up before that field was numeric-only (e.g. free text like
 * "5-10 hours"), which wouldn't parse cleanly as a single number.
 */
const formatEffort = (effort: string | null, intl: IntlShape) => {
  const hours = Number(effort);

  if (effort && Number.isFinite(hours)) {
    return intl.formatMessage(messages.estimatedEffortHours, { hours });
  }

  return effort;
};

/**
 * Generates an array of sidebar detail objects for course information display.
 * Each detail object contains metadata about a specific course attribute.
*/
export const getSidebarDetails = (
  intl: IntlShape,
  courseAboutData: CourseAboutData,
) => [
  {
    key: SIDEBAR_DETAIL_KEYS.START_DATE,
    icon: FlagLineIcon,
    label: intl.formatMessage(messages.releaseDate),
    value: formatDate(((courseAboutData.advertisedStart || courseAboutData.start) ?? ''), intl),
    show: !courseAboutData.startDateIsStillDefault,
  },
  {
    key: SIDEBAR_DETAIL_KEYS.END_DATE,
    icon: ArchiveLineIcon,
    label: intl.formatMessage(messages.archiveDate),
    value: formatDate((courseAboutData.end ?? ''), intl),
    show: !!courseAboutData.end,
  },
  {
    key: SIDEBAR_DETAIL_KEYS.EFFORT,
    // Not in the design (see icons.tsx) — kept at the same visual weight.
    icon: TrendingUpLineIcon,
    label: intl.formatMessage(messages.estimatedEffort),
    value: formatEffort(courseAboutData.effort, intl),
    show: !!courseAboutData.effort,
  },
  {
    key: SIDEBAR_DETAIL_KEYS.DURATION,
    icon: ClockLineIcon,
    label: intl.formatMessage(messages.courseDuration),
    value: courseAboutData.duration,
    show: !!courseAboutData.duration,
  },
  {
    key: SIDEBAR_DETAIL_KEYS.STUDENTS_ENROLLED,
    icon: UsersLineIcon,
    label: intl.formatMessage(messages.studentsEnrolled),
    // Locale-grouped (e.g. "12,345"), matching the polish already applied to
    // the date/effort values above rather than a plain, ungrouped number.
    value: courseAboutData.enrolledStudentsCount != null
      ? intl.formatNumber(courseAboutData.enrolledStudentsCount)
      : null,
    show: courseAboutData.enrolledStudentsCount != null,
  },
];
