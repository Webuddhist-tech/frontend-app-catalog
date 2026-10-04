import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'catalog.home-page.rebrand-notice.title',
    defaultMessage: 'Sherab is now WeBuddhist Academy',
    description: 'Heading of the notice on the home page announcing the rename from Sherab to WeBuddhist Academy.',
  },
  body: {
    id: 'catalog.home-page.rebrand-notice.body',
    defaultMessage: 'Only our name has changed. Your courses, data, certificates and progress stay the same.',
    description: 'Reassurance line under the rebrand notice heading, telling learners nothing else about their account changed.',
  },
  close: {
    id: 'catalog.home-page.rebrand-notice.close',
    defaultMessage: 'Close',
    description: 'Accessible label for the button that dismisses the rebrand notice.',
  },
});

export default messages;
