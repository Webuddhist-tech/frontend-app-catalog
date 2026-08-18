import { useContext, type ReactNode } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import type { AppContextTypes } from '@src/header/types';
import { getGreetingName } from './utils';
import messages from './messages';

/**
 * Renders the `<accent>` tag both headings wrap their variable part in.
 *
 * Defined at module scope so it is the same function on every render, rather
 * than a fresh component type React would tear the heading down to swap.
 */
const renderAccent = (chunks: ReactNode[]) => (
  <span className="home-hero__title-accent">{chunks}</span>
);

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
