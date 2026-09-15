import { Button } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import messages from '../messages';

// Lives in the sidebar rather than attached to any one content section: the
// sidebar always renders regardless of which (if any) main-content sections
// have content, so this never ends up as an orphaned button with no card
// around it, the way it did tied to Course Overview specifically.
export const StudioLink = ({ courseId }: { courseId: string }) => {
  const intl = useIntl();
  const authenticatedUser = getAuthenticatedUser();
  const isGlobalStaff = authenticatedUser?.administrator || false;

  if (!isGlobalStaff) {
    return null;
  }

  // The divider and padding live on this wrapper itself, not on a shared
  // sibling-combinator rule: this button is the one row whose CSS kept
  // rendering without its top line in the live app despite the rule
  // checking out in source, compiled output, and isolated render tests, so
  // its line is now owned directly by the element that needs it instead of
  // depending on how it sits among its siblings.
  return (
    <div className="course-about-studio-link-section">
      <Button
        as="a"
        size="sm"
        variant="outline-primary"
        className="course-about-studio-link"
        href={`${getConfig().STUDIO_BASE_URL}/settings/details/${courseId}`}
      >
        {intl.formatMessage(messages.viewAboutPageInStudio)}
      </Button>
    </div>
  );
};

export default StudioLink;
