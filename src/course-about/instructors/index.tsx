import { useState } from 'react';
import { Container, Card, Image } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import type { Instructor } from '../types';
import messages from '../messages';
import { hasVisibleHtmlContent } from '../utils';

const InstructorItem = ({ instructor }: { instructor: Instructor }) => {
  const intl = useIntl();
  const [imageFailed, setImageFailed] = useState(false);
  const {
    name, title, organization, image, bio,
  } = instructor;

  const titleOrg = [title, organization].filter(Boolean).join(' — ');
  const hasBio = hasVisibleHtmlContent(bio);

  return (
    <div className="course-about-instructor">
      <div className="course-about-instructor__head">
        {image && !imageFailed && (
          <Image
            className="course-about-instructor__image"
            src={image}
            alt={intl.formatMessage(messages.instructorImageAlt, { name: name || '' })}
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="course-about-instructor__identity">
          {name && <p className="course-about-instructor__name">{name}</p>}
          {titleOrg && <p className="course-about-instructor__title">{titleOrg}</p>}
        </div>
      </div>
      {hasBio && (
        /* eslint-disable-next-line react/no-danger */
        <div className="course-about-instructor__bio" dangerouslySetInnerHTML={{ __html: bio as string }} />
      )}
    </div>
  );
};

export const Instructors = ({ instructorInfo }: { instructorInfo: Instructor[] }) => {
  const intl = useIntl();

  const instructors = (instructorInfo || []).filter(
    instructor => instructor && (!!instructor.name?.trim() || hasVisibleHtmlContent(instructor.bio)),
  );

  if (!instructors.length) {
    return null;
  }

  return (
    <Container className="px-0">
      <Card className="course-about-instructors-card">
        <Card.Header title={<h2 className="my-0 h3">{intl.formatMessage(messages.instructorsHeading)}</h2>} />
        <Card.Section>
          <div className="course-about-instructors">
            {instructors.map((instructor, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <InstructorItem key={index} instructor={instructor} />
            ))}
          </div>
        </Card.Section>
      </Card>
    </Container>
  );
};

export default Instructors;
