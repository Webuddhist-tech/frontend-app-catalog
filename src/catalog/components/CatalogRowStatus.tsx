import { useContext, type ReactNode } from 'react';
import { DataTable, DataTableContext } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import type { CatalogDataTableContext } from './types';

// Defined at module scope so it's the same function on every render rather
// than a fresh component type.
const renderBold = (chunks: ReactNode[]) => <strong>{chunks}</strong>;

/**
 * The catalog's "Showing 1–20 of 99 courses" line.
 *
 * Only the wording differs from Paragon's default, so this delegates to
 * Paragon's own RowStatus via its `statusText` prop rather than reimplementing
 * it — that keeps its `data-testid` hook and its "render nothing when there are
 * no rows" guard instead of silently dropping them.
 */
const CatalogRowStatus = ({ className }: { className?: string }) => {
  const intl = useIntl();
  const {
    page, rows, itemCount, state,
  } = useContext(DataTableContext) as CatalogDataTableContext;

  const rowCount = page?.length || rows?.length || 0;
  const firstRow = (state?.pageSize || 0) * (state?.pageIndex || 0) + 1;
  const lastRow = firstRow + rowCount - 1;

  return (
    <DataTable.RowStatus
      className={className}
      // Wrapped in a fragment: rich-text formatMessage returns an array of
      // nodes, but `statusText` accepts a single string or element.
      statusText={(
        <>
          {intl.formatMessage(messages.rowStatus, {
            firstRow,
            lastRow,
            itemCount,
            b: renderBold,
          })}
        </>
      )}
    />
  );
};

export default CatalogRowStatus;
