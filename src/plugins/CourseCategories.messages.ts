import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'category.catalog.home-page.course-categories.title',
    defaultMessage: 'Course Categories',
    description: 'Heading above the homepage course categories section.',
  },
  tablistLabel: {
    id: 'category.catalog.home-page.course-categories.tablist-label',
    defaultMessage: 'Course categories',
    description: 'Accessible label for the row of category tabs.',
  },
  errorTitle: {
    id: 'category.catalog.home-page.course-categories.error-title',
    defaultMessage: 'Unable to load course categories',
    description: 'Title of the alert shown when the categories fail to load.',
  },
  errorMessage: {
    id: 'category.catalog.home-page.course-categories.error-message',
    defaultMessage: 'Please try again later.',
    description: 'Body of the alert shown when the categories fail to load.',
  },
});

export default messages;
