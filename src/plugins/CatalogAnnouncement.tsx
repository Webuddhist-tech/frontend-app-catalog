import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useHomepageAnnouncement } from '@src/data/catalog-announcement/hooks';
import messages from './CatalogAnnouncement.messages';

// Styles live in the brand package: brand-openedx/paragon/_catalog.scss,
// pulled in globally via src/index.scss.

const DISMISSED_MESSAGE_KEY = 'sherab.catalog.announcement.dismissed';

const readDismissedMessage = () => {
  try {
    return window.localStorage.getItem(DISMISSED_MESSAGE_KEY);
  } catch {
    return null;
  }
};

const CatalogAnnouncement = () => {
  const intl = useIntl();
  const { data: message } = useHomepageAnnouncement();
  const [dismissedMessage, setDismissedMessage] = useState(readDismissedMessage);

  if (!message || message === dismissedMessage) {
    return null;
  }

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISSED_MESSAGE_KEY, message);
    } catch {
      // Hide it for this view even when storage is blocked.
    }
    setDismissedMessage(message);
  };

  return (
    <section className="catalog-announcement" aria-label={intl.formatMessage(messages.label)}>
      <p className="catalog-announcement__message">{message}</p>
      <button
        type="button"
        className="catalog-announcement__dismiss"
        aria-label={intl.formatMessage(messages.dismiss)}
        onClick={dismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </section>
  );
};

export default CatalogAnnouncement;
