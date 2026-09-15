import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import CourseAboutEnrollmentButtonSlot from '@src/plugin-slots/CourseAboutEnrollmentButtonSlot';
import CourseAboutWishlistButtonSlot from '@src/plugin-slots/CourseAboutWishlistButtonSlot';
import {
  StatusMessage, EnrolledStatus, InviteOnlyStatus,
} from '../components';
import { getLearningHomePageUrl } from '../utils';
import messages from '../messages';
import { STATUS_MESSAGE_VARIANTS } from '../constants';
import type { UseEnrollmentStatusTypes } from './types';

export const useEnrollmentStatus = ({
  courseAboutData,
  enrollmentError,
  authenticatedUser,
  isEnrollmentPending,
  handleChangeEnrollment,
  handleEcommerceCheckout,
}: UseEnrollmentStatusTypes) => {
  const intl = useIntl();
  const {
    id: courseId,
    canEnroll,
    enrollment,
    isShibCourse,
    isCourseFull,
    allowAnonymous,
    singlePaidMode,
    invitationOnly,
    ecommerceCheckout,
    showCoursewareLink,
  } = courseAboutData;

  const renderStatusContent = () => {
    if (enrollmentError) {
      return <StatusMessage variant={STATUS_MESSAGE_VARIANTS.DANGER} messageKey="statusMessageEnrollmentError" />;
    }

    if (authenticatedUser && enrollment.isActive) {
      return (
        <EnrolledStatus
          courseId={courseId}
          enrollmentMode={enrollment.mode}
        />
      );
    }

    if (isCourseFull) {
      return <StatusMessage variant={STATUS_MESSAGE_VARIANTS.INFO} messageKey="statusMessageFull" />;
    }

    if (invitationOnly && !canEnroll) {
      return <InviteOnlyStatus courseId={courseId} />;
    }

    if (!isShibCourse && !canEnroll) {
      return <StatusMessage variant={STATUS_MESSAGE_VARIANTS.INFO} messageKey="statusMessageEnrollmentClosed" />;
    }

    if (allowAnonymous && showCoursewareLink) {
      return (
        <Button as="a" variant="secondary" href={getLearningHomePageUrl(courseId)}>
          {intl.formatMessage(messages.viewCourseBtn)}
        </Button>
      );
    }

    // Enroll + Wishlist as flat siblings, not wrapped in their own Stack: the
    // hero's own .pgn__card-footer CSS already handles the gap and the
    // wrap/stack-on-mobile behaviour for however many direct children it has.
    return (
      <>
        <CourseAboutEnrollmentButtonSlot
          singlePaidMode={singlePaidMode}
          ecommerceCheckout={ecommerceCheckout}
          isEnrollmentPending={isEnrollmentPending}
          onEnroll={handleChangeEnrollment}
          onEcommerceCheckout={handleEcommerceCheckout}
        />
        <CourseAboutWishlistButtonSlot courseId={courseId} />
      </>
    );
  };

  return { renderStatusContent };
};
