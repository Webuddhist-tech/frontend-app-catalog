import { getAuthenticatedHttpClient, getHttpClient } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { renderHook, waitFor } from '@src/setupTest';
import { fetchHeroCourses } from '../api';
import { useHeroCourses } from '../hooks';
import { getHeroCoursesUrl } from '../urls';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
  getHttpClient: jest.fn(),
}));

const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.Mock;
const mockGetHttpClient = getHttpClient as jest.Mock;

const apiResponse = [{
  course_id: 'course-v1:Org+A+2026',
  title: 'Buddhist Logic and Epistemology',
  image_url: 'https://lms.example.com/asset/a.jpg',
  provider_name: 'Khyentse Foundation',
  provider_logo: 'https://lms.example.com/logo/kf.png',
}];

const camelised = [{
  courseId: 'course-v1:Org+A+2026',
  title: 'Buddhist Logic and Epistemology',
  imageUrl: 'https://lms.example.com/asset/a.jpg',
  providerName: 'Khyentse Foundation',
  providerLogo: 'https://lms.example.com/logo/kf.png',
}];

describe('hero courses data layer', () => {
  const authenticatedClient = { get: jest.fn() };
  const plainClient = { get: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthenticatedHttpClient.mockReturnValue(authenticatedClient);
    mockGetHttpClient.mockReturnValue(plainClient);
    authenticatedClient.get.mockResolvedValue({ data: apiResponse });
    plainClient.get.mockResolvedValue({ data: apiResponse });
  });

  describe('fetchHeroCourses', () => {
    it('uses the authenticated client when signed in, so cookies are sent', async () => {
      const result = await fetchHeroCourses(true);

      expect(authenticatedClient.get).toHaveBeenCalledWith(getHeroCoursesUrl());
      expect(plainClient.get).not.toHaveBeenCalled();
      expect(result).toEqual(camelised);
    });

    it('uses the plain client when signed out, so the JWT interceptor cannot block it', async () => {
      const result = await fetchHeroCourses(false);

      expect(plainClient.get).toHaveBeenCalledWith(getHeroCoursesUrl());
      expect(authenticatedClient.get).not.toHaveBeenCalled();
      expect(result).toEqual(camelised);
    });

    it('returns an empty list when the response is not an array', async () => {
      plainClient.get.mockResolvedValue({ data: null });

      await expect(fetchHeroCourses(false)).resolves.toEqual([]);
    });
  });

  describe('useHeroCourses', () => {
    const renderWithUser = (authenticatedUser: { username: string } | null) => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

      return renderHook(() => useHeroCourses(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{ authenticatedUser, config: {} } as any}>
              {children}
            </AppContext.Provider>
          </QueryClientProvider>
        ),
      });
    };

    it('fetches with the plain client for an anonymous visitor', async () => {
      const { result } = renderWithUser(null);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual(camelised);
      expect(plainClient.get).toHaveBeenCalled();
    });

    it('fetches with the authenticated client for a signed-in learner', async () => {
      const { result } = renderWithUser({ username: 'tenzin' });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual(camelised);
      expect(authenticatedClient.get).toHaveBeenCalled();
    });

    it('caches per user, so one visitor never sees another\'s courses', async () => {
      const anonymous = renderWithUser(null);
      await waitFor(() => expect(anonymous.result.current.isLoading).toBe(false));

      const signedIn = renderWithUser({ username: 'tenzin' });
      await waitFor(() => expect(signedIn.result.current.isLoading).toBe(false));

      // A shared cache key would have served the cached anonymous response and
      // never called the authenticated client at all.
      expect(authenticatedClient.get).toHaveBeenCalledTimes(1);
    });
  });
});
