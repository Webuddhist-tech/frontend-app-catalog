import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { DataTable } from '@openedx/paragon';

import FilterChips from '@src/catalog/components/FilterChips';
import type { CourseCatalogDataTableControlBarSlotProps } from './types';

const CourseCatalogDataTableControlBarSlot = ({
  currentPageResultsCount,
  totalResultsCount,
}: CourseCatalogDataTableControlBarSlotProps) => (
  <PluginSlot
    id="org.openedx.frontend.catalog.course_catalog_page.data_table.control_bar"
    slotOptions={{
      mergeProps: true,
    }}
    pluginProps={{
      currentPageResultsCount,
      totalResultsCount,
    }}
  >
    <DataTable.TableControlBar />
    <FilterChips />
  </PluginSlot>
);

export default CourseCatalogDataTableControlBarSlot;
