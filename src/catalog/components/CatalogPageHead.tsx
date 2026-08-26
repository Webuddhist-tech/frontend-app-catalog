import { type ReactNode } from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { breakpoints, useMediaQuery } from '@openedx/paragon';

import messages from '../messages';
import type { CatalogPageHeadProps } from './types';

/**
 * Renders the `<accent>` tag the heading wraps its emphasized words in.
 *
 * Defined at module scope so it is the same function on every render, rather
 * than a fresh component type React would tear the heading down to swap.
 */
const renderAccent = (chunks: ReactNode[]) => (
  <span className="catalog-page-head__title-accent">{chunks}</span>
);

/**
 * The catalog page's heading. With no active search it shows the brand eyebrow
 * plus the accented "Discover new" title; an active search shows `searchTitle`
 * instead (search results / no results / etc.).
 *
 * `searchTitle` arrives pre-resolved rather than being derived here from a
 * result count: this renders inside a PluginSlot, and the plugin framework's
 * prop merging rewrites every falsy prop value to an empty string — so a
 * genuine count of 0 would arrive as '' and read as "has results".
 */
const CatalogPageHead = ({ searchString, searchTitle }: CatalogPageHeadProps) => {
  const intl = useIntl();
  const isMedium = useMediaQuery({ maxWidth: breakpoints.medium.maxWidth });
  const isDefaultView = !searchString;

  return (
    <header className={classNames('catalog-page-head', { 'mx-2.5': isMedium })}>
      {isDefaultView && (
        <p className="catalog-page-head__eyebrow">
          <span className="catalog-page-head__eyebrow-rule" aria-hidden="true" />
          {intl.formatMessage(messages.pageEyebrow)}
        </p>
      )}
      <h1 className="catalog-page-head__title">
        {isDefaultView
          ? intl.formatMessage(messages.pageHeading, { accent: renderAccent })
          : searchTitle}
      </h1>
    </header>
  );
};

export default CatalogPageHead;
