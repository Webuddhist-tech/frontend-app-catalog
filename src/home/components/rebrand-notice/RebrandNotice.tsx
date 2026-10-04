import { useState, type AnimationEvent } from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';

import messages from './messages';

/**
 * A card above the home page hero telling learners that Sherab has been renamed
 * to WeBuddhist Academy and nothing else about their account changed.
 *
 * Shown on every page load; closing it only hides it until the next one. While
 * it's open the hero sits a little lower, and closing it collapses the notice
 * so the hero eases back to its usual place. It is unmounted once that exit
 * animation ends.
 */
const RebrandNotice = () => {
  const intl = useIntl();
  const [isHidden, setIsHidden] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  if (isHidden) {
    return null;
  }

  // Only the notice's own exit animation counts, not the card's entrance
  // animation bubbling up from inside it.
  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (isLeaving && event.target === event.currentTarget) {
      setIsHidden(true);
    }
  };

  return (
    <aside
      className={classNames('rebrand-notice', { 'rebrand-notice--leaving': isLeaving })}
      aria-labelledby="rebrand-notice-title"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="rebrand-notice__inner">
        <div className="rebrand-notice__card">
          <div className="rebrand-notice__text">
            <p className="rebrand-notice__title" id="rebrand-notice-title">
              {intl.formatMessage(messages.title)}
            </p>
            <p className="rebrand-notice__body">{intl.formatMessage(messages.body)}</p>
          </div>
          <button
            type="button"
            className="rebrand-notice__close"
            aria-label={intl.formatMessage(messages.close)}
            onClick={() => setIsLeaving(true)}
          >
            <Icon src={Close} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RebrandNotice;
