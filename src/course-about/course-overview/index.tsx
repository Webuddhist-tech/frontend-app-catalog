import { Container, Card } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import { hasVisibleHtmlContent } from '../utils';
import type { CourseOverviewProps } from './types';
import { processOverviewContent } from './utils';

export const CourseOverview = ({ overviewData }: CourseOverviewProps) => {
  const intl = useIntl();

  const processedOverviewData = processOverviewContent(overviewData, getConfig().LMS_BASE_URL);

  if (!hasVisibleHtmlContent(processedOverviewData)) {
    return null;
  }

  return (
    <Container className="px-0">
      <Card>
        <Card.Header title={<h2 className="my-0 h3">{intl.formatMessage(messages.courseOverviewHeading)}</h2>} />
        <Card.Section>
          {
            /* eslint-disable-next-line react/no-danger */
            <div className="course-about-overview" dangerouslySetInnerHTML={{ __html: processedOverviewData }} />
          }
        </Card.Section>
      </Card>
    </Container>
  );
};

export default CourseOverview;
