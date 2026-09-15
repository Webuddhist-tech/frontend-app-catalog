import classNames from 'classnames';
import { Card, Container } from '@openedx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { tibetanModifierClass } from '@src/utils';
import type { CourseAboutDataPartial } from '../types';
import { useEnrollmentActions, useEnrollmentStatus } from './hooks';

export const CourseIntro = ({ courseAboutData }: { courseAboutData: CourseAboutDataPartial }) => {
  const authenticatedUser = getAuthenticatedUser();

  const {
    id: courseId,
    displayOrgWithDefault: courseOrg,
    name: courseName,
    ecommerceCheckoutLink,
  } = courseAboutData;

  const {
    enrollmentError,
    isEnrollmentPending,
    handleChangeEnrollment,
    handleEcommerceCheckout,
  } = useEnrollmentActions({ courseId, ecommerceCheckoutLink });

  const { renderStatusContent } = useEnrollmentStatus({
    courseAboutData,
    enrollmentError,
    authenticatedUser,
    isEnrollmentPending,
    handleChangeEnrollment,
    handleEcommerceCheckout,
  });

  return (
    <Container className="course-about-intro px-0">
      <Card>
        <Card.Header
          title={(
            <h1 className={classNames('my-0', tibetanModifierClass(courseName, 'course-about-intro-title--tibetan'))}>
              {courseName}
            </h1>
          )}
          subtitle={courseOrg}
        />
        <Card.Footer className="justify-content-start">
          {renderStatusContent()}
        </Card.Footer>
      </Card>
    </Container>
  );
};
