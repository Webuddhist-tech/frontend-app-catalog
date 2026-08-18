import { getConfig } from '@edx/frontend-platform';

import {
  render, screen, waitFor, within,
} from '@src/setupTest';
import courseCardMessages from '@src/generic/course-card/messages';
import { useCourseListSearch } from '@src/data/course-list-search/hooks';
import { useHeroCourses } from '@src/data/hero-courses/hooks';
import { mockCourseListSearchResponse } from '@src/__mocks__';
import { DATE_FORMAT_OPTIONS } from '../constants';
import HomePage from './HomePage';
import messages from './components/home-banner/messages';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    SITE_NAME: process.env.SITE_NAME,
    ENABLE_COURSE_DISCOVERY: process.env.ENABLE_COURSE_DISCOVERY,
  })),
  ensureConfig: jest.fn(),
}));

jest.mock('@src/data/course-list-search/hooks', () => ({
  useCourseListSearch: jest.fn(),
}));

jest.mock('@src/data/hero-courses/hooks', () => ({
  useHeroCourses: jest.fn(),
}));

const mockCourseListSearch = useCourseListSearch as jest.Mock;
const mockUseHeroCourses = useHeroCourses as jest.Mock;

describe('HomePage', () => {
  mockCourseListSearch.mockReturnValue({
    data: mockCourseListSearchResponse,
    isLoading: false,
    isError: false,
  });

  // Empty, so the hero adds no cards of its own and the course-grid assertions
  // below can keep counting every link on the page.
  mockUseHeroCourses.mockReturnValue({ data: [], isLoading: false, isError: false });

  it('sets correct document title', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(document.title).toBe(process.env.SITE_NAME);
    });
  });

  it('renders without crashing', () => {
    render(<HomePage />);

    // The heading holds the site name inside an accent element, so it is
    // asserted by text content rather than as one contiguous string.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `Welcome to ${process.env.SITE_NAME}`,
    );
    expect(screen.getByText(messages.eyebrowSignedOut.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId('home-banner')).toBeInTheDocument();
  });

  it('no longer renders the promo video button', () => {
    render(<HomePage />);

    expect(screen.queryByRole('button', { name: messages.videoButton.defaultMessage })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not pass enableCourseDiscovery to HomeBanner', () => {
    getConfig.mockReturnValue({
      ENABLE_COURSE_DISCOVERY: !process.env.ENABLE_COURSE_DISCOVERY,
    });

    render(<HomePage />);
    expect(screen.getByTestId('home-banner')).toBeInTheDocument();
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(messages.searchPlaceholder.defaultMessage)).not.toBeInTheDocument();
  });

  describe('CoursesList', () => {
    it('renders course cards with correct count', async () => {
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');
      expect(courseCards.length).toBe(mockCourseListSearchResponse.results.length);
    });

    it('renders course cards with correct links', async () => {
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');

      courseCards.forEach((card, index) => {
        const course = mockCourseListSearchResponse.results[index];
        expect(card).toHaveAttribute('href', `/courses/${course.id}/about`);
      });
    });

    it('renders course images with correct URLs and alt text', async () => {
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');

      courseCards.forEach((card, index) => {
        const course = mockCourseListSearchResponse.results[index];
        const cardContent = within(card);

        const courseImage = cardContent.getByAltText(course.data.content.displayName);
        expect(courseImage).toHaveAttribute('src', `${getConfig().LMS_BASE_URL}${course.data.imageUrl}`);
      });
    });

    it('renders course text content correctly', async () => {
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');

      courseCards.forEach((card, index) => {
        const course = mockCourseListSearchResponse.results[index];
        const cardContent = within(card);

        expect(cardContent.getByText(course.data.content.displayName)).toBeInTheDocument();
        // The org stands in for the institution name, which the search index
        // does not carry. The course number is no longer shown on the card.
        expect(cardContent.getByText(course.data.org)).toBeInTheDocument();
      });
    });

    it('renders course start dates correctly with advertisedStart priority', async () => {
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');

      courseCards.forEach((card, index) => {
        const course = mockCourseListSearchResponse.results[index];
        const cardContent = within(card);

        expect(cardContent.getByText(
          courseCardMessages.startDate.defaultMessage.replace('{startDate}', course.data.advertisedStart),
        )).toBeInTheDocument();
      });
    });

    it('renders formatted start date when advertisedStart is not available', async () => {
      const mockResponseWithoutAdvertisedStart = {
        ...mockCourseListSearchResponse,
        results: mockCourseListSearchResponse.results.map(course => ({
          ...course,
          data: {
            ...course.data,
            advertisedStart: undefined,
          },
        })),
      };

      mockCourseListSearch.mockReturnValueOnce({
        data: mockResponseWithoutAdvertisedStart,
        isLoading: false,
        isError: false,
      });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const courseCards = screen.getAllByRole('link');

      courseCards.forEach((card, index) => {
        const course = mockResponseWithoutAdvertisedStart.results[index];
        const cardContent = within(card);

        const expectedDate = new Intl.DateTimeFormat(
          'en-US',
          DATE_FORMAT_OPTIONS,
        ).format(new Date(course.data.start));

        expect(cardContent.getByText(
          courseCardMessages.startDate.defaultMessage.replace('{startDate}', expectedDate),
        )).toBeInTheDocument();
      });
    });
  });
});
