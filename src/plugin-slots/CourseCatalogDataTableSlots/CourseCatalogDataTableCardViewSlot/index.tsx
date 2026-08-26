import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { CardView } from '@openedx/paragon';

import { DEFAULT_PAGE_SIZE } from '@src/data/course-list-search/constants';
import { CourseListSearchResponse } from '@src/data/course-list-search/types';
import CourseCatalogDataTableCourseCardSlot from './CourseCatalogDataTableCourseCardSlot';

const CourseCatalogDataTableCardViewSlot = ({ displayData }: { displayData?: CourseListSearchResponse }) => (
  <PluginSlot
    id="org.openedx.frontend.catalog.course_catalog_page.data_table.card_view"
    slotOptions={{
      mergeProps: true,
    }}
    pluginProps={{
      displayData,
    }}
  >
    <CardView
      CardComponent={CourseCatalogDataTableCourseCardSlot}
      skeletonCardCount={Math.min(displayData?.total ?? DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE)}
      // CardView lays cards out with a Bootstrap Row/Col grid, not CSS grid —
      // this is the actual hook for a 3/2/1 responsive column count.
      columnSizes={{ xs: 12, sm: 6, lg: 4 }}
    />
  </PluginSlot>
);

export default CourseCatalogDataTableCardViewSlot;
