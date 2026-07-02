import { StatefulButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import type { EnrollmentButtonTypes } from './types';

export const EnrollmentButton = ({
  onEnroll,
  ecommerceCheckout,
  isEnrollmentPending,
  onEcommerceCheckout,
}: EnrollmentButtonTypes) => {
  const intl = useIntl();

  return (
    <StatefulButton
      variant="primary"
      onClick={ecommerceCheckout ? onEcommerceCheckout : onEnroll}
      state={isEnrollmentPending ? 'pending' : 'default'}
      labels={{
        default: intl.formatMessage(messages.enrollNowBtn),
        pending: intl.formatMessage(messages.enrollNowBtnPending),
      }}
    />
  );
};
