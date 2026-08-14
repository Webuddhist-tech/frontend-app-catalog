import { PluginSlot } from '@openedx/frontend-plugin-framework';

import { CourseCard } from '@src/generic';
import type { CourseCatalogDataTableCourseCardSlotProps } from './types';

const CourseCatalogDataTableCourseCardSlot = ({
  original: courseData, isLoading,
}: CourseCatalogDataTableCourseCardSlotProps) => {
  const courseCardProps = {
    isLoading,
    courseId: courseData?.id,
    courseOrg: courseData?.data.org,
    courseName: courseData?.data.content.displayName,
    courseImageUrl: courseData?.data.imageUrl,
    // The search index carries a logo but no institution name, so the card
    // falls back to showing the course organization.
    providerLogoUrl: courseData?.data.partnerLogoUrl || courseData?.data.orgImageUrl,
    courseStartDate: courseData?.data.start,
    courseAdvertisedStart: courseData?.data.advertisedStart,
    showStartDate: true,
  };

  return (
    <PluginSlot
      id="org.openedx.frontend.catalog.course_catalog_page.data_table.course_card"
      slotOptions={{
        mergeProps: true,
      }}
      pluginProps={courseCardProps}
    >
      <CourseCard {...courseCardProps} />
    </PluginSlot>
  );
};

export default CourseCatalogDataTableCourseCardSlot;
