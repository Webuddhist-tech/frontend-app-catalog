import { useContext } from 'react';
import {
  Pagination, DataTableContext, breakpoints, useMediaQuery,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import type { CatalogDataTableContext } from './types';

// Mirrors Paragon's own TablePagination (rendered by the default
// DataTable.TableFooter), just with a brand-styled, responsive variant
// instead of always 'reduced'. `gotoPage` is react-table's own instance
// method, so paging still runs through the same fetchData/handleFetchData
// flow already wired up in CatalogPage.
//
// Two tiers, deliberately: 'default' (full numbered pager) on desktop and
// 'reduced' (prev/next plus a "1 of 5" dropdown) below it. Paragon's stock
// footer also renders a third 'minimal' pager, but that one is bare arrows
// with no position indicator — a downgrade from 'reduced', and Paragon ships
// no CSS to hide either, so stock would stack two pagers at once.
const CatalogPagination = () => {
  const intl = useIntl();
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const {
    pageCount, state, gotoPage,
  } = useContext(DataTableContext) as CatalogDataTableContext;

  if (!pageCount || pageCount < 2) {
    return null;
  }

  return (
    <Pagination
      variant={isSmall ? 'reduced' : 'default'}
      currentPage={(state?.pageIndex ?? 0) + 1}
      onPageSelect={(pageNum: number) => gotoPage(pageNum - 1)}
      pageCount={pageCount}
      paginationLabel={intl.formatMessage(messages.paginationLabel)}
    />
  );
};

export default CatalogPagination;
