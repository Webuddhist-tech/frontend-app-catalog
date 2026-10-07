import { useIntl } from '@edx/frontend-platform/i18n';

import { useHomepageAnnouncement } from '@src/data/catalog-announcement/hooks';
import messages from './CatalogAnnouncement.messages';

// Styles live in the brand package: brand-openedx/paragon/_catalog.scss,
// pulled in globally via src/index.scss.

const CatalogAnnouncement = () => {
  const intl = useIntl();
  const { data: message } = useHomepageAnnouncement();

  if (!message) {
    return null;
  }

  return (
    <section className="catalog-announcement" aria-label={intl.formatMessage(messages.label)}>
      <p className="catalog-announcement__message">{message}</p>
    </section>
  );
};

export default CatalogAnnouncement;
