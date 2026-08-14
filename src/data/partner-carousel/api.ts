import { camelCaseObject } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

import { getPartnersHomepageUrl } from './urls';
import type { Partner } from './types';

/**
 * Fetches the partner logos shown on the homepage carousel.
 */
export const fetchPartners = async (): Promise<Partner[]> => {
  // The unauthenticated client: this endpoint allows anonymous access and the
  // homepage renders for signed-out visitors, for whom the authenticated
  // client would attempt a pointless token refresh.
  const { data } = await getHttpClient().get(getPartnersHomepageUrl());

  return camelCaseObject(Array.isArray(data) ? data : []);
};
