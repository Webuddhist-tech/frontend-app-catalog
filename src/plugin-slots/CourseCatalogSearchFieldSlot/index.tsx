import { PluginSlot } from '@openedx/frontend-plugin-framework';
import {
  breakpoints, Form, SearchField, useMediaQuery,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import { getConfig } from '@edx/frontend-platform';

import sharedMessages from '@src/generic/messages';
import type { CourseCatalogSearchFieldSlotProps } from './types';

const CourseCatalogSearchFieldSlot = ({
  setSearchInput,
  handleSearch,
  initialSearchValue,
}: CourseCatalogSearchFieldSlotProps) => {
  const intl = useIntl();
  const isMedium = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });

  return (
    <PluginSlot
      id="org.openedx.frontend.catalog.course_catalog_page.search_field"
      slotOptions={{
        mergeProps: true,
      }}
      pluginProps={{
        setSearchInput,
        handleSearch,
        initialSearchValue,
      }}
    >
      {getConfig().ENABLE_COURSE_DISCOVERY && (
        <Form.Group
          key="search-field"
          className={classNames('catalog-page-head__search', {
            'mx-2.5 mb-4': isMedium,
            'mb-5': !isMedium,
          })}
        >
          <SearchField
            placeholder={intl.formatMessage(sharedMessages.courseSearchPlaceholder)}
            onChange={(value: string) => {
              setSearchInput(value);
            }}
            onSubmit={(value: string) => {
              setSearchInput(value);
              handleSearch(value);
            }}
            value={initialSearchValue}
          />
        </Form.Group>
      )}
    </PluginSlot>
  );
};

export default CourseCatalogSearchFieldSlot;
