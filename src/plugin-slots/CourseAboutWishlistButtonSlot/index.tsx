import { PluginSlot } from '@openedx/frontend-plugin-framework';

import { WishlistButton } from '@src/course-about/course-intro/wishlist/WishlistButton';

const CourseAboutWishlistButtonSlot = ({ courseId }: { courseId: string }) => (
  <PluginSlot
    id="org.openedx.frontend.catalog.course_about_page.wishlist_button"
    slotOptions={{
      mergeProps: true,
    }}
    pluginProps={{ courseId }}
  >
    <WishlistButton courseId={courseId} />
  </PluginSlot>
);

export default CourseAboutWishlistButtonSlot;
