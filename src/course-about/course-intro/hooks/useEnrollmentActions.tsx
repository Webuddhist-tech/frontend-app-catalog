import {
  useState, useMemo, useEffect,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { useEnrollment } from '../../data/hooks';
import messages from '../messages';
import type { UseEnrollmentActionsTypes } from './types';

export const useEnrollmentActions = ({ courseId, ecommerceCheckoutLink }: UseEnrollmentActionsTypes) => {
  const intl = useIntl();
  const [enrollmentError, setEnrollmentError] = useState<null | string>(null);
  const [isEnrollmentPending, setIsEnrollmentPending] = useState(false);

  const enrollmentConfig = useMemo(() => ({
    onError: setEnrollmentError,
    errorMessage: intl.formatMessage(messages.statusMessageEnrollmentError),
  }), [intl]);

  const enrollAndRedirect = useEnrollment(enrollmentConfig);

  // handleChangeEnrollment only ever clears the pending flag on the error
  // path — on success it navigates away instead, which normally makes that
  // fine (a fresh page load starts pending back at false). But the browser
  // can restore this exact page from its back-forward cache instead of
  // reloading it, when the user hits Back from the dashboard this redirects
  // to — freezing it with isEnrollmentPending still true from the instant
  // navigation began, so the button is stuck reading "Enrolling..." forever.
  // `pageshow`'s `persisted` flag fires specifically for that bfcache
  // restore, so this only ever resets a stale spinner, never a live request.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsEnrollmentPending(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleChangeEnrollment = async () => {
    setIsEnrollmentPending(true);
    try {
      await enrollAndRedirect(courseId, `${getConfig().LMS_BASE_URL}/dashboard`);
    } catch (error) {
      setIsEnrollmentPending(false);
      logError('Failed to enroll in course', error);
    }
  };

  const handleEcommerceCheckout = () => {
    if (!ecommerceCheckoutLink) {
      logError('Ecommerce checkout link is not available');
      return;
    }
    window.location.assign(ecommerceCheckoutLink);
  };

  return {
    enrollmentError,
    isEnrollmentPending,
    handleChangeEnrollment,
    handleEcommerceCheckout,
  };
};
