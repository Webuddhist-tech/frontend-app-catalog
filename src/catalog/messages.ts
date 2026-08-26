import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'category.catalog.page-title',
    defaultMessage: 'Courses',
    description: 'Catalog page title.',
  },
  errorMessage: {
    id: 'category.catalog.error-page-message',
    defaultMessage: 'If you experience repeated failures, please email support at {supportEmail}',
    description: 'Error page message.',
  },
  noCoursesAvailable: {
    id: 'category.catalog.alert.no-courses-available',
    defaultMessage: 'No courses available',
    description: 'No courses available alert title.',
  },
  noCoursesAvailableMessage: {
    id: 'category.catalog.alert.no-courses-available-message',
    defaultMessage: 'There are currently no courses available in the catalog. Please check back later for new offerings.',
    description: 'No courses available alert message.',
  },
  searchResults: {
    id: 'category.catalog.search-results',
    defaultMessage: 'Search results for "{query}"',
    description: 'Search results heading.',
  },
  noSearchResults: {
    id: 'category.catalog.no-search-results',
    defaultMessage: 'We couldn\'t find any results for "{query}"',
    description: 'No search results.',
  },
  noResultsFound: {
    id: 'category.catalog.no-results-found',
    defaultMessage: 'No results found',
    description: 'No results found.',
  },
  organizations: {
    id: 'category.catalog.filter.organizations',
    defaultMessage: 'Organizations',
    description: 'Organizations filter.',
  },
  languages: {
    id: 'category.catalog.filter.languages',
    defaultMessage: 'Languages',
    description: 'Languages filter.',
  },
  courseTypes: {
    id: 'category.catalog.filter.course-types',
    defaultMessage: 'Course types',
    description: 'Course types filter.',
  },
  pageEyebrow: {
    id: 'category.catalog.page-eyebrow',
    defaultMessage: 'The full catalogue',
    description: 'Small label above the catalog page heading.',
  },
  pageHeading: {
    id: 'category.catalog.page-heading',
    defaultMessage: 'Discover <accent>new</accent>',
    description: 'Catalog page heading. Text inside <accent> is styled differently'
      + ' (italic, accent color) but is part of the same sentence, so translations'
      + ' may move the tag to wherever the emphasis belongs.',
  },
  filtersTitle: {
    id: 'category.catalog.filter.title',
    defaultMessage: 'Filters',
    description: 'Heading above the filter sidebar.',
  },
  clearFiltersText: {
    id: 'category.catalog.filter.clear-all',
    defaultMessage: 'Clear all',
    description: 'Button that clears every active filter.',
  },
  removeFilter: {
    id: 'category.catalog.filter.remove-chip',
    defaultMessage: 'Remove filter: {label}',
    description: 'Accessible label for a chip\'s remove button.',
  },
  paginationLabel: {
    id: 'category.catalog.pagination-label',
    defaultMessage: 'Course catalog pagination',
    description: 'Accessible label for the pagination nav.',
  },
  rowStatus: {
    id: 'category.catalog.row-status',
    defaultMessage: 'Showing <b>{firstRow}–{lastRow}</b> of <b>{itemCount}</b> {itemCount, plural, one {course} other {courses}}',
    description: 'Describes how many of the total courses the current page is showing. <b> wraps the counts in bold.',
  },
});

export default messages;
