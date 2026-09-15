import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  errorMessage: {
    id: 'category.catalog.error-page-message',
    defaultMessage: 'If you experience repeated failures, please email support at {supportEmail}',
    description: 'Error page message.',
  },
  viewAboutPageInStudio: {
    id: 'catalog.course-about.view-about-page-in-studio',
    defaultMessage: 'View About Page in Studio',
    description: 'Link to view the Schedule and Details page in Studio.',
  },
  aboutThisCourseHeading: {
    id: 'catalog.course-about.about-this-course.heading',
    defaultMessage: 'About This Course',
    description: 'Heading for the long course description section.',
  },
  learningOutcomesHeading: {
    id: 'catalog.course-about.learning-outcomes.heading',
    defaultMessage: 'What you will learn',
    description: 'Heading for the learning outcomes section.',
  },
  instructorsHeading: {
    id: 'catalog.course-about.instructors.heading',
    defaultMessage: 'Instructors',
    description: 'Heading for the instructors section.',
  },
  instructorImageAlt: {
    id: 'catalog.course-about.instructors.image-alt',
    defaultMessage: 'Photo of {name}',
    description: 'Alt text for an instructor photo.',
  },
  courseRequirementsHeading: {
    id: 'catalog.course-about.course-requirements.heading',
    defaultMessage: 'Course Requirements',
    description: 'Heading for the course requirements (marketing title) section.',
  },
  courseOverviewHeading: {
    id: 'catalog.course-about.course-overview.heading',
    defaultMessage: 'Course Overview',
    description: 'Heading for the course overview section.',
  },
  courseShortDescriptionHeading: {
    id: 'catalog.course-about.course-short-description.heading',
    defaultMessage: 'At a Glance',
    description: 'Heading for the short course description section.',
  },
});

export default messages;
