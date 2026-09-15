import { Container, Card } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { processOverviewContent } from '@src/course-about/course-overview/utils';
import messages from '../messages';
import { hasVisibleHtmlContent } from '../utils';

export const CourseDescription = ({ description }: { description: string | null }) => {
  const intl = useIntl();

  const processedDescription = processOverviewContent(description || '', getConfig().LMS_BASE_URL);

  if (!hasVisibleHtmlContent(processedDescription)) {
    return null;
  }

  return (
    <Container className="px-0">
      <Card>
        <Card.Header title={<h2 className="my-0 h3">{intl.formatMessage(messages.aboutThisCourseHeading)}</h2>} />
        <Card.Section>
          {
            /* eslint-disable-next-line react/no-danger */
            <div className="course-about-description" dangerouslySetInnerHTML={{ __html: processedDescription }} />
          }
        </Card.Section>
      </Card>
    </Container>
  );
};

export default CourseDescription;
