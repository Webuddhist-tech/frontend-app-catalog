import { IntlShape } from '@edx/frontend-platform/i18n';
import capitalize from 'lodash.capitalize';

import type { Aggregations, DataTableFilter } from '@src/data/course-list-search/types';
import CollapsibleFilterGroup from './components/CollapsibleFilterGroup';
import type { GetSearchTitleProps } from './types';
import messages from './messages';

/**
 * Gets the display name for a language code.
 */
const getLanguageName = (languageCode: string, locale: string = 'en'): string => {
  try {
    const languageNames = new Intl.DisplayNames([locale], { type: 'language' });
    return languageNames.of(languageCode) || languageCode;
  } catch (error) {
    return capitalize(languageCode);
  }
};

/**
 * Formats a filter choice's raw term (an org/course-type slug, e.g.
 * "karmaling-birmingham-england" or "khyentse_foundation") into a readable
 * label. `capitalize` alone only capitalizes the first letter of the whole
 * string, leaving slugs as one long unbroken word — this splits on the
 * slug's own hyphens/underscores first, so each word capitalizes and wraps
 * on its own.
 */
const formatChoiceName = (term: string): string => term
  .split(/[-_]+/)
  .filter(Boolean)
  .map((word) => capitalize(word))
  .join(' ');

/**
 * Transforms aggregations into filter choices for DataTable.
 */
export const transformAggregationsToFilterChoices = (aggregations: Aggregations | undefined, intl: IntlShape) => {
  if (!aggregations) { return []; }

  const headerMap: Record<string, string> = {
    org: intl.formatMessage(messages.organizations),
    language: intl.formatMessage(messages.languages),
    modes: intl.formatMessage(messages.courseTypes),
  };

  return Object.entries(aggregations).map(([key, aggValue]) => {
    const terms = aggValue.terms || {};
    const filterChoices = Object.entries(terms).map(([termKey, count]) => {
      const displayName = key === 'language'
        ? getLanguageName(termKey, intl.locale)
        : formatChoiceName(termKey);

      return {
        name: displayName,
        number: count,
        value: termKey,
      };
    });

    return {
      Header: headerMap[key] || capitalize(key),
      accessor: key,
      Filter: CollapsibleFilterGroup,
      filter: 'includesValue',
      filterChoices,
    };
  });
};

/**
 * Compares two arrays of filters and returns true if they are the same.
 */
export const compareFilters = (
  filters1: DataTableFilter[] | undefined,
  filters2: DataTableFilter[] | undefined,
): boolean => {
  if (filters1 === filters2) {
    return true;
  }

  if (!filters1 || !filters2) {
    return false;
  }

  if (filters1.length !== filters2.length) {
    return false;
  }

  const createFilterKey = (filter: DataTableFilter) => {
    const sortedValues = [...filter.value].sort().join(',');
    return `${filter.id}:${sortedValues}`;
  };

  const set1 = new Set(filters1.map(createFilterKey));
  const set2 = new Set(filters2.map(createFilterKey));

  return set1.size === set2.size && [...set1].every(key => set2.has(key));
};

/**
 * The heading shown while a search is active: either the "no results" wording
 * or the "results for X" wording.
 *
 * Only call this when `searchString` is non-empty — with no search the page
 * shows its own branded heading instead (see CatalogPageHead), so there is no
 * "default" title for this to return.
 */
export const getSearchTitle = ({
  intl,
  searchString,
  courseDataResultsLength,
}: GetSearchTitleProps) => {
  if ((courseDataResultsLength ?? 0) === 0) {
    return intl.formatMessage(messages.noSearchResults, { query: searchString });
  }

  return intl.formatMessage(messages.searchResults, { query: searchString });
};
