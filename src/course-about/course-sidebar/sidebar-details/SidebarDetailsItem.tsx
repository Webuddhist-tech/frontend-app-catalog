import { Icon, Stack } from '@openedx/paragon';

import type { SidebarDetailsItemProps } from './types';

// No trailing Card.Divider here: the divider between rows is drawn in CSS
// instead (see _catalog.scss), because a divider baked into each item
// assumes something always follows it — which breaks the moment an item
// happens to be last (e.g. this one, when it's the final sidebar fact and
// Studio Link isn't shown), leaving a trailing line with nothing below it.
const SidebarDetailsItem = ({ icon, label, value }: SidebarDetailsItemProps) => (
  <Stack className="justify-content-between flex-wrap p-3" gap={2} direction="horizontal">
    <Stack direction="horizontal" gap={2}>
      <Icon src={icon} />
      <span data-testid="sidebar-details-item-label">{label}</span>
    </Stack>
    <span className="font-weight-bolder" data-testid="sidebar-details-item-value">{value}</span>
  </Stack>
);

export default SidebarDetailsItem;
