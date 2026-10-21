import { useEffect, useMemo } from 'react';
import { Container, Alert } from '@openedx/paragon';
import { ErrorPage } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE } from '@src/data/course-list-search/constants';
import { useCourseListSearch } from '@src/data/course-list-search/hooks';
import CourseCatalogIntroSlot from '@src/plugin-slots/CourseCatalogIntroSlot';
import { CourseCatalogDataTableSlot } from '@src/plugin-slots/CourseCatalogDataTableSlots';
import CourseCatalogSearchFieldSlot from '@src/plugin-slots/CourseCatalogSearchFieldSlot';
import CatalogEmptyResults from './components/CatalogEmptyResults';
import { useDebouncedSearchInput } from './hooks/useDebouncedSearchInput';
import { AlertNotification, Loading, Head } from '../generic';
import { useCatalog } from './hooks/useCatalog';
import messages from './messages';
import { transformAggregationsToFilterChoices } from './utils';

const CatalogPage = () => {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search_query') || '';
  const {
    data: courseData,
    isLoading,
    isError,
    fetchData,
    isFetching,
  } = useCourseListSearch({ searchString: searchQuery });

  const {
    pageIndex,
    filterState,
    searchString,
    hasInitializedFromUrl,
    urlSearchQuery,
    previousCourseData,
    handleSearch,
    handleFetchData,
    resetFilterProgress,
  } = useCatalog({
    fetchData, courseData, isFetching, searchParams, setSearchParams,
  });

  const { setSearchInput } = useDebouncedSearchInput({
    searchString,
    handleSearch,
  });

  // Cards follow the live response. A zero-hit response often has no aggregations,
  // so the filter sidebar keeps the last set that had choices.
  const displayData = useMemo(() => {
    if (!courseData || (courseData.results?.length ?? 0) > 0) {
      return courseData;
    }
    const hasLiveAggs = Boolean(courseData.aggs && Object.keys(courseData.aggs).length);
    if (hasLiveAggs || !previousCourseData?.aggs) {
      return courseData;
    }
    return {
      ...courseData,
      aggs: previousCourseData.aggs,
      organizationDisplayNames: courseData.organizationDisplayNames
        ?? previousCourseData.organizationDisplayNames,
    };
  }, [courseData, previousCourseData]);

  useEffect(() => {
    if (!isFetching && filterState.isFilterChangeInProgress) {
      resetFilterProgress();
    }
  }, [isFetching, filterState.isFilterChangeInProgress, resetFilterProgress]);

  const tableColumns = useMemo(
    () => transformAggregationsToFilterChoices(
      displayData?.aggs,
      intl,
      displayData?.organizationDisplayNames,
    ),
    [displayData?.aggs, displayData?.organizationDisplayNames, intl],
  );

  if (isLoading || (!hasInitializedFromUrl && urlSearchQuery)) {
    return (
      <Loading />
    );
  }

  if (isError) {
    return (
      <Container className="py-5.5">
        <Alert variant="danger">
          <ErrorPage
            message={intl.formatMessage(messages.errorMessage, {
              supportEmail: getConfig().INFO_EMAIL,
            })}
          />
        </Alert>
      </Container>
    );
  }

  const totalCourses = courseData?.results?.length ?? 0;
  const pageCount = Math.ceil((courseData?.total || totalCourses) / DEFAULT_PAGE_SIZE);
  const searchMiss = Boolean(searchString) && totalCourses === 0;
  // The cleared search still has the zero-hit response on screen until the
  // full catalog returns. That gap is not an empty catalog.
  const awaitingCatalog = isFetching && totalCourses === 0 && !(previousCourseData?.total);
  const hasCourses = totalCourses > 0 || searchMiss || (previousCourseData?.total ?? 0) > 0;

  const searchField = (
    <CourseCatalogSearchFieldSlot
      setSearchInput={setSearchInput}
      handleSearch={handleSearch}
      initialSearchValue={searchString}
    />
  );

  let catalogBody = (
    <AlertNotification
      title={intl.formatMessage(messages.noCoursesAvailable)}
      message={intl.formatMessage(messages.noCoursesAvailableMessage)}
    />
  );
  if (searchMiss || awaitingCatalog) {
    catalogBody = (
      <>
        {searchField}
        <CatalogEmptyResults />
      </>
    );
  } else if (hasCourses) {
    catalogBody = (
      <>
        {searchField}
        <CourseCatalogDataTableSlot
          displayData={displayData}
          totalCourses={totalCourses}
          pageCount={pageCount}
          pageIndex={pageIndex}
          tableColumns={tableColumns}
          handleFetchData={handleFetchData}
        />
      </>
    );
  }

  return (
    <>
      <Head title={intl.formatMessage(messages.pageTitle)} />
      <Container fluid={false} size="xl" className="catalog-page pt-5.5 mb-6">
        <CourseCatalogIntroSlot searchString={searchString} courseDataResultsLength={courseData?.results?.length} />
        {catalogBody}
      </Container>
    </>
  );
};

export default CatalogPage;
