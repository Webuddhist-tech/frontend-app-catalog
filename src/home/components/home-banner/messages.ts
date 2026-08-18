import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  eyebrowSignedOut: {
    id: 'catalog.home-page.eyebrow-signed-out',
    defaultMessage: 'Buddhist Learning Platform',
    description: 'Small label above the home page heading, shown to signed-out visitors.',
  },
  eyebrowSignedIn: {
    id: 'catalog.home-page.eyebrow-signed-in',
    defaultMessage: 'Continue your practice',
    description: 'Small label above the home page heading, shown to a signed-in learner.',
  },
  title: {
    id: 'catalog.home-page.title',
    defaultMessage: 'Welcome to <accent>{siteName}</accent>',
    description: 'Main home page heading for signed-out visitors. The accent tag styles the site name.',
  },
  welcomeBack: {
    id: 'catalog.home-page.welcome-back',
    defaultMessage: 'Welcome back, <accent>{name}</accent>',
    description: 'Main home page heading for a signed-in learner. The accent tag styles their name.',
  },
  searchPlaceholder: {
    id: 'catalog.home-page.search-placeholder',
    defaultMessage: 'What would you like to learn?',
    description: 'Placeholder text inside the course search input field.',
  },
  heroCourses: {
    id: 'catalog.home-page.hero-courses',
    defaultMessage: 'Featured courses',
    description: 'Accessible label for the pair of course cards beside the home page heading.',
  },
  newCourse: {
    id: 'catalog.home-page.new-course',
    defaultMessage: 'New course',
    description: 'Badge on a home page hero card marking a recently added course.',
  },
  providerLogoAlt: {
    id: 'catalog.home-page.provider-logo-alt',
    defaultMessage: '{providerName} logo',
    description: 'Alternative text for the institution logo on a home page course card.',
  },
  videoButton: {
    id: 'catalog.home-page.video-button',
    defaultMessage: 'View promo video',
    description: 'Label for the button that opens the promotional video modal.',
  },
});

export default messages;
