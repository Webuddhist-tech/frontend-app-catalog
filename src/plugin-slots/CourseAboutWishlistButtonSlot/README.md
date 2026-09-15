# Course wishlist button slot

### Slot ID: `org.openedx.frontend.catalog.course_about_page.wishlist_button`

## Description

This slot is used to replace/modify/hide the Wishlist button on the Course About page hero. It renders only for authenticated visitors to an open-enrollment or invitation-only course (there's no anonymous wishlist, and the button doesn't apply once a visitor is already enrolled).

## Example

The following `env.config.tsx` will replace the Wishlist button entirely:

```tsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { Button } from '@openedx/paragon';

const config = {
  pluginSlots: {
    'org.openedx.frontend.catalog.course_about_page.wishlist_button': {
      keepDefault: false,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_course_about_page_wishlist_button_component',
            type: DIRECT_PLUGIN,
            RenderWidget: ({ courseId }) => (
              <Button onClick={() => console.log(`wishlist ${courseId}`)}>
                Save for later
              </Button>
            ),
          },
        },
      ],
    },
  },
};

export default config;
```
