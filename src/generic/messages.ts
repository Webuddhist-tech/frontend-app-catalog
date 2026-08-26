import { defineMessages } from '@edx/frontend-platform/i18n';

/**
 * Strings shared by more than one feature, so translators are asked for them
 * once and the copy can't drift between pages.
 */
const messages = defineMessages({
  courseSearchPlaceholder: {
    // The id deliberately keeps its original home-page name rather than being
    // renamed to something neutral: it is the id this exact wording already
    // shipped under, so existing translations keep working. The catalog's own
    // former id carried translations of the older "Search for a course"
    // wording, which no longer matches the English.
    id: 'catalog.home-page.search-placeholder',
    defaultMessage: 'What would you like to learn?',
    description: 'Placeholder text inside a course search input field.',
  },
});

export default messages;
