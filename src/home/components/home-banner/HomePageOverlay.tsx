import { useContext, type ReactNode } from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import type { AppContextTypes } from '@src/header/types';
import { containsTibetanScript } from '@src/utils';
import { getGreetingName } from './utils';
import messages from './messages';

/**
 * Renders the `<accent>` tag both headings wrap their variable part in.
 *
 * Defined at module scope so it is the same function on every render, rather
 * than a fresh component type React would tear the heading down to swap.
 *
 * The extra modifier class is only added when the wrapped text is actually
 * Tibetan script: that's the case that needs more line-height than this
 * heading's own (Jomolhari's stacked consonants and vowel signs reach well
 * above/below a normal line) — an English name keeps the tighter default.
 */
const renderAccent = (chunks: ReactNode[]) => {
  const text = chunks.map(String).join('');

  return (
    <span
      className={classNames('home-hero__title-accent', {
        'home-hero__title-accent--tibetan': containsTibetanScript(text),
      })}
    >
      {chunks}
    </span>
  );
};

/**
 * The hero's text block: a small eyebrow label above the page heading.
 *
 * Both lines depend on whether anyone is signed in — a returning learner is
 * greeted by name and invited to carry on, a first-time visitor is told what
 * the site is.
 */
const HomePageOverlay = () => {
  const intl = useIntl();
  const { SITE_NAME } = getConfig();
  const { authenticatedUser } = useContext(AppContext) as AppContextTypes;

  const heading = authenticatedUser
    ? intl.formatMessage(messages.welcomeBack, {
      name: getGreetingName(authenticatedUser),
      accent: renderAccent,
    })
    : intl.formatMessage(messages.title, {
      siteName: SITE_NAME,
      accent: renderAccent,
    });

  return (
    <>
      <p className="home-hero__eyebrow">
        <span className="home-hero__eyebrow-rule" aria-hidden="true" />
        {intl.formatMessage(authenticatedUser ? messages.eyebrowSignedIn : messages.eyebrowSignedOut)}
      </p>
      <h1 className="home-hero__title">{heading}</h1>
    </>
  );
};

export default HomePageOverlay;
