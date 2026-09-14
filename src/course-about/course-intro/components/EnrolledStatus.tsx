import {
  breakpoints, Button, Stack, useMediaQuery,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getLearningHomePageUrl } from '../utils';
import messages from '../messages';
import { STATUS_MESSAGE_VARIANTS } from '../constants';
import type { EnrolledStatusTypes } from './types';
import { StatusMessage } from './StatusMessage';

// Covers both the plain-enrolled and verified/purchased cases: they only
// differ in which status message reads, not in layout or the button — there
// is no "Manage purchase" link, since nothing in this app manages a purchase
// yet.
export const EnrolledStatus = ({ courseId, enrollmentMode }: EnrolledStatusTypes) => {
  const intl = useIntl();
  // "large" rather than "small": side by side, the status pill and the
  // button were squeezing each other down to an uncomfortably narrow width
  // well before running out of room outright — laptop-width screens, not
  // just phone ones.
  const isCompact = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });
  const isVerified = enrollmentMode === 'verified';

  return (
    <Stack direction={isCompact ? 'vertical' : 'horizontal'} gap={isCompact ? 2 : 5}>
      <StatusMessage
        variant={STATUS_MESSAGE_VARIANTS.SUCCESS}
        messageKey={isVerified ? 'statusMessagePurchased' : 'statusMessageEnrolled'}
      />
      <Button as="a" variant="secondary" href={getLearningHomePageUrl(courseId)}>
        {intl.formatMessage(messages.viewCourseBtn)}
      </Button>
    </Stack>
  );
};
