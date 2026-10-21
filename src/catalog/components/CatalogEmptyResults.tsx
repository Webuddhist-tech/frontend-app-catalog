import { useIntl } from '@edx/frontend-platform/i18n';

import glass from '../assets/discover-empty/1-glass.svg';
import messages from '../messages';

const CatalogEmptyResults = () => {
  const intl = useIntl();
  return (
    <div className="catalog-empty-results">
      <img className="catalog-empty-results__illustration" src={glass} alt="" />
      <h2>{intl.formatMessage(messages.noResultsFound)}</h2>
      <p>{intl.formatMessage(messages.noResultsFoundMessage)}</p>
    </div>
  );
};

export default CatalogEmptyResults;
