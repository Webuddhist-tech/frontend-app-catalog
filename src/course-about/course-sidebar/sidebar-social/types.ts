import type { ComponentType, SVGProps } from 'react';

export interface SocialLink {
  id: string;
  destination: string;
  // The component passed as <Icon src={...} />, not Icon itself — `typeof
  // Icon` previously here only worked because Paragon's own icon modules are
  // untyped JS, so nothing caught it not actually matching Icon's own props.
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  screenReaderText: string;
}
