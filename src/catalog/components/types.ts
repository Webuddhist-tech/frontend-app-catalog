export interface CatalogPageHeadProps {
  searchString: string;
  /** Pre-resolved heading for an active search; see CatalogPageHead. */
  searchTitle?: string;
}

export interface FilterChoice {
  name: string;
  value: string;
  number?: number;
}

/**
 * Shape of a react-table column once react-table's filtering plugin has
 * processed it — richer than the plain `TableColumn` definition passed into
 * `DataTable`'s `columns` prop (see CourseCatalogDataTableSlot/types.ts).
 */
export interface FilterColumn {
  id: string;
  Header: string;
  filterValue?: string[];
  setFilter: (value: string[]) => void;
  filterChoices: FilterChoice[];
  getHeaderProps: () => { key: string };
}

/**
 * The parts of Paragon's `DataTableContext` this page's components read.
 *
 * One shared description rather than one per component: the context is a
 * single object, so four separate (and previously disagreeing) declarations of
 * it could drift apart silently. Optional members are the ones that only exist
 * in some table configurations, so callers must guard them.
 */
export interface CatalogDataTableContext {
  /** Rows on the current page; absent when the table isn't paginated. */
  page?: unknown[];
  /** All rows, used as the fallback when `page` is absent. */
  rows?: unknown[];
  /** Total results across every page, not just the current one. */
  itemCount: number;
  pageCount: number;
  /**
   * Optional because Paragon defaults this context to `{}` — a component
   * rendered outside a `<DataTable>` sees no state at all. Paragon's own
   * RowStatus guards it the same way, so callers must too.
   */
  state?: {
    pageIndex?: number;
    pageSize?: number;
    filters?: { id: string, value: string[] }[];
  };
  gotoPage: (pageIndex: number) => void;
  /** Only present while the table is filterable. */
  setAllFilters?: (filters: unknown[]) => void;
  columns: FilterColumn[];
}
