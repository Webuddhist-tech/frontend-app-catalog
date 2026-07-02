import {
  Icon, Hyperlink, OverlayTrigger, Tooltip,
} from '@openedx/paragon';

import type { SocialLink } from './types';

const SocialLinks = ({ socialLinks }: { socialLinks: SocialLink[] }) => (
  <>
    {socialLinks.map((link) => (
      <OverlayTrigger
        key={link.id}
        placement="top"
        overlay={(
          <Tooltip id={`social-share-tooltip-${link.id}`} className="course-about-social-tooltip">
            {link.screenReaderText}
          </Tooltip>
        )}
      >
        <Hyperlink destination={link.destination}>
          <Icon
            src={link.icon}
            screenReaderText={link.screenReaderText}
          />
        </Hyperlink>
      </OverlayTrigger>
    ))}
  </>
);

export default SocialLinks;
