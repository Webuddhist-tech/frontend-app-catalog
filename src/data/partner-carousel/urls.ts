import { getConfig } from '@edx/frontend-platform';

export const getApiBaseUrl = () => getConfig().LMS_BASE_URL;

export const getPartnersHomepageUrl = () => `${getApiBaseUrl()}/api/partners/homepage/`;
