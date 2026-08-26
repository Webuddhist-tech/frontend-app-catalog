import { useIntl } from '@edx/frontend-platform/i18n';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import CatalogPageHead from '@src/catalog/components/CatalogPageHead';
import { getSearchTitle } from '@src/catalog/utils';
import type { CourseCatalogIntroSlotProps } from './types';

const CourseCatalogIntroSlot = ({
  searchString,
  courseDataResultsLength,
}: CourseCatalogIntroSlotProps) => {
  const intl = useIntl();

  // Resolved here, not inside CatalogPageHead: PluginSlot's prop merging
  // rewrites falsy prop values to an empty string, so a real result count of
  // 0 would reach the child as '' and be mistaken for "has results".
  // Skipped entirely with no search, since the heading is the branded one then.
  const searchTitle = searchString
    ? getSearchTitle({ intl, searchString, courseDataResultsLength })
    : undefined;

  return (
    <PluginSlot
      id="org.openedx.frontend.catalog.course_catalog_page.intro"
      slotOptions={{
        mergeProps: true,
      }}
      pluginProps={{ searchString, courseDataResultsLength }}
    >
      <CatalogPageHead searchString={searchString} searchTitle={searchTitle} />
    </PluginSlot>
  );
};

export default CourseCatalogIntroSlot;
