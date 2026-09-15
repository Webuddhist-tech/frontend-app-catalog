import { useEffect, useState } from 'react';
import { Button, StatefulButton } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import { ShoppingCartLineIcon } from '../course-about/course-intro/icons';
import messages from '../course-about/course-intro/messages';
import type { EnrollmentButtonTypes } from '../course-about/course-intro/components/types';

const parseCourseIdFromCatalogPath = (): string | null => {
  const match = window.location.pathname.match(/\/courses\/([^/]+)\/about\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

type BuyCourseEnrollmentButtonProps = Pick<EnrollmentButtonTypes, 'onEnroll' | 'isEnrollmentPending'>;

export const BuyCourseEnrollmentButton = ({
  onEnroll,
  isEnrollmentPending,
}: BuyCourseEnrollmentButtonProps) => {
  const intl = useIntl();
  const [purchaseLink, setPurchaseLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseId = parseCourseIdFromCatalogPath();
    if (!courseId) {
      setLoading(false);
      return undefined;
    }

    const url = `${getConfig().LMS_BASE_URL}/api/courses/v1/courses/${encodeURIComponent(courseId)}/`;

    getAuthenticatedHttpClient()
      .get(url)
      .then(({ data }) => {
        setPurchaseLink(data.purchase_link || null);
      })
      .catch(() => {
        setPurchaseLink(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return undefined;
  }, []);

  // Checking whether this course has a purchase link — not the same thing
  // as an enrollment actually being submitted, so this gets its own label
  // rather than reusing "Enrolling...", which reads as if the user had
  // already clicked something.
  if (loading) {
    return (
      <Button variant="primary" disabled>
        {intl.formatMessage(messages.checkingEnrollmentOptionsBtn)}
      </Button>
    );
  }

  if (purchaseLink) {
    return (
      <Button
        variant="primary"
        iconBefore={ShoppingCartLineIcon}
        className="course-about-buy-course-btn"
        onClick={() => {
          window.location.assign(purchaseLink);
        }}
      >
        {intl.formatMessage(messages.buyCourseBtn)}
      </Button>
    );
  }

  return (
    <StatefulButton
      variant="primary"
      onClick={onEnroll}
      state={isEnrollmentPending ? 'pending' : 'default'}
      labels={{
        default: intl.formatMessage(messages.enrollNowBtn),
        pending: intl.formatMessage(messages.enrollNowBtnPending),
      }}
    />
  );
};

export default BuyCourseEnrollmentButton;
