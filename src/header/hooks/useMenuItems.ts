import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';

import { ROUTES } from '@src/routes';
import { programsUrl } from '@src/utils';
import type { AppContextTypes, MenuItem } from '../types';
import messages from '../messages';

/**
 * The wishlist lives on the LMS rather than in this MFE, so it is not one of ROUTES.
 * Resolves against LMS_BASE_URL, which is local.openedx.io in development and the
 * site domain in production.
 */
const WISHLIST_PATH = '/wishlist/';

export const useMenuItems = () => {
  const intl = useIntl();
  const location = useLocation();
  const { authenticatedUser } = useContext(AppContext) as AppContextTypes;

  const isCourseCatalogPage = location.pathname === ROUTES.COURSES;

  const getNotAuthenticatedUserMainMenu = (): MenuItem[] => [
    ...(getConfig().ENABLE_COURSE_DISCOVERY ? [{
      type: 'item' as const,
      href: `${getConfig().LMS_BASE_URL}${ROUTES.COURSES}`,
      content: intl.formatMessage(messages.exploreCourses),
      isActive: isCourseCatalogPage,
      iconName: 'discover' as const,
    }] : []),
  ];

  const getAuthenticatedUserMainMenu = (): MenuItem[] => [
    {
      type: 'item' as const,
      href: `${getConfig().LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages.dashboard),
      iconName: 'dashboard' as const,
    },
    ...(getConfig().ENABLE_PROGRAMS ? [{
      type: 'item' as const,
      href: programsUrl(),
      content: intl.formatMessage(messages.programs),
      iconName: 'programs' as const,
    }] : []),
    ...(!getConfig().NON_BROWSABLE_COURSES ? [{
      type: 'item' as const,
      href: `${getConfig().LMS_BASE_URL}${ROUTES.COURSES}`,
      content: intl.formatMessage(messages.discoverNew),
      isActive: isCourseCatalogPage,
      iconName: 'discover' as const,
    }] : []),
    {
      type: 'item' as const,
      href: `${getConfig().LMS_BASE_URL}${WISHLIST_PATH}`,
      content: intl.formatMessage(messages.wishlist),
      iconName: 'wishlist' as const,
    },
  ];

  const getSecondaryMenu = (): MenuItem[] => [
    ...(getConfig().SUPPORT_URL ? [{
      type: 'item' as const,
      href: `${getConfig().SUPPORT_URL}`,
      content: intl.formatMessage(messages.help),
    }] : []),
  ];

  return {
    mainMenu: authenticatedUser ? getAuthenticatedUserMainMenu() : getNotAuthenticatedUserMainMenu(),
    secondaryMenu: getSecondaryMenu(),
  };
};
