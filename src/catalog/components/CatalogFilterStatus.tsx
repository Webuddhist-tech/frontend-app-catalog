import { DataTable } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';

/**
 * Mobile/tablet "Filtered by X" status bar shown below the Filters dropdown.
 *
 * Only the "Clear all" wording differs from Paragon's default "Clear
 * filters" — delegates to Paragon's own FilterStatus via `clearFiltersText`
 * so it stays the same button used everywhere else (`filterValue`
 * clearing, `pgn__smart-status-button` class) rather than reimplementing it.
 */
const CatalogFilterStatus = ({ className }: { className?: string }) => {
  const intl = useIntl();

  return (
    <DataTable.FilterStatus
      className={className}
      clearFiltersText={intl.formatMessage(messages.clearFiltersText)}
    />
  );
};

export default CatalogFilterStatus;
