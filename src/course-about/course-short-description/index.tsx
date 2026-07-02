import { Container, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';

export const CourseShortDescription = ({ shortDescription }: { shortDescription?: string }) => {
  const intl = useIntl();

  if (!shortDescription?.trim()) {
    return null;
  }

  return (
    <Container className="px-0">
      <Card>
        <Card.Header title={<h2 className="my-0 h3">{intl.formatMessage(messages.courseShortDescriptionHeading)}</h2>} />
        <Card.Section>
          <p className="course-about-short-description mb-0">{shortDescription}</p>
        </Card.Section>
      </Card>
    </Container>
  );
};

export default CourseShortDescription;
