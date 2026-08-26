import { useContext } from 'react';
import { DataTableContext } from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import type { CatalogDataTableContext, FilterChoice, FilterColumn } from './types';

interface ActiveChip {
  columnId: string;
  column: FilterColumn;
  choice: FilterChoice;
}

// One chip per selected checkbox value, across every filter group — removing
// a chip calls the exact `setFilter` Paragon's own checkboxes use, so the
// sidebar never falls out of sync with what's shown here.
const FilterChips = () => {
  const intl = useIntl();
  const { state, columns } = useContext(DataTableContext) as CatalogDataTableContext;

  const activeChips: ActiveChip[] = (state?.filters ?? []).flatMap((filter) => {
    const column = columns.find((c) => c.id === filter.id);
    if (!column) { return []; }
    return (filter.value ?? [])
      .map((value) => column.filterChoices.find((choice) => choice.value === value))
      .filter((choice): choice is FilterChoice => Boolean(choice))
      .map((choice) => ({ columnId: filter.id, column, choice }));
  });

  if (!activeChips.length) {
    return null;
  }

  return (
    <div className="catalog-filter-chips">
      {activeChips.map(({
        columnId, column, choice,
      }) => (
        <span className="catalog-filter-chips__chip" key={`${columnId}-${choice.value}`}>
          {choice.name}
          <button
            type="button"
            aria-label={intl.formatMessage(messages.removeFilter, { label: choice.name })}
            onClick={() => column.setFilter(
              (column.filterValue ?? []).filter((value) => value !== choice.value),
            )}
          >
            <Close />
          </button>
        </span>
      ))}
    </div>
  );
};

export default FilterChips;
