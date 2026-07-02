import { Container, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import { hasVisibleHtmlContent } from '../utils';

export const LearningOutcomes = ({ learningInfo }: { learningInfo: string[] }) => {
  const intl = useIntl();

  const outcomes = (learningInfo || []).filter(hasVisibleHtmlContent);

  if (!outcomes.length) {
    return null;
  }

  return (
    <Container className="px-0">
      <Card>
        <Card.Header title={<h2 className="my-0 h3">{intl.formatMessage(messages.learningOutcomesHeading)}</h2>} />
        <Card.Section>
          <ul className="course-about-learning-outcomes pl-4 mb-0">
            {outcomes.map((outcome, index) => (
              <li
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                /* eslint-disable-next-line react/no-danger */
                dangerouslySetInnerHTML={{ __html: outcome }}
              />
            ))}
          </ul>
        </Card.Section>
      </Card>
    </Container>
  );
};

export default LearningOutcomes;
