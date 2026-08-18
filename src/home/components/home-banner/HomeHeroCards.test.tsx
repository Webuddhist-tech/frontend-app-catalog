import { getConfig } from '@edx/frontend-platform';

import {
  render, screen, cleanup, act, userEvent,
} from '@src/setupTest';
import { useHeroCourses } from '@src/data/hero-courses/hooks';
import HomeHeroCards from './HomeHeroCards';

import messages from './messages';

jest.mock('@src/data/hero-courses/hooks', () => ({
  useHeroCourses: jest.fn(),
}));

const mockUseHeroCourses = useHeroCourses as jest.Mock;

// Both default to isNew/isEnrolled: false so neither stays out of the way of
// every test that is not about it.
const courseA = {
  courseId: 'course-v1:Org+A+2026',
  title: 'Buddhist Logic and Epistemology',
  imageUrl: 'https://lms.example.com/asset/a.jpg',
  providerName: 'Khyentse Foundation',
  providerLogo: 'https://lms.example.com/logo/kf.png',
  isNew: false,
  isEnrolled: false,
};

const courseB = {
  courseId: 'course-v1:Org+B+2026',
  title: 'Discovering the Buddha Within',
  imageUrl: null,
  providerName: 'Kagyu Yeshe',
  providerLogo: null,
  isNew: false,
  isEnrolled: false,
};

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('<HomeHeroCards />', () => {
  it('renders both cards when two courses come back', () => {
    mockUseHeroCourses.mockReturnValue({ data: [courseA, courseB], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    expect(screen.getByTestId('home-hero-cards')).toBeInTheDocument();
    expect(screen.getByText(courseA.title)).toBeInTheDocument();
    expect(screen.getByText(courseB.title)).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  describe('the front/back swap', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockUseHeroCourses.mockReturnValue({ data: [courseA, courseB], isLoading: false, isError: false });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('trades the cards places on a timer', () => {
      render(<HomeHeroCards />);

      const [first] = screen.getAllByRole('link');
      expect(first).toHaveClass('home-hero__card--front');

      act(() => { jest.advanceTimersByTime(3000); });

      expect(screen.getAllByRole('link')[0]).toHaveClass('home-hero__card--back');
    });

    it('holds the cards still while one is hovered', async () => {
      render(<HomeHeroCards />);

      const [first] = screen.getAllByRole('link');
      expect(first).toHaveClass('home-hero__card--front');

      await userEvent.hover(screen.getByTestId('home-hero-cards'), { advanceTimers: jest.advanceTimersByTime });
      act(() => { jest.advanceTimersByTime(9000); });

      // Still leading: a card being read must not slide behind the other.
      expect(screen.getAllByRole('link')[0]).toHaveClass('home-hero__card--front');
    });

    it('resumes once the cursor leaves', async () => {
      render(<HomeHeroCards />);
      const group = screen.getByTestId('home-hero-cards');

      await userEvent.hover(group, { advanceTimers: jest.advanceTimersByTime });
      act(() => { jest.advanceTimersByTime(9000); });
      expect(screen.getAllByRole('link')[0]).toHaveClass('home-hero__card--front');

      await userEvent.unhover(group, { advanceTimers: jest.advanceTimersByTime });
      act(() => { jest.advanceTimersByTime(3000); });

      expect(screen.getAllByRole('link')[0]).toHaveClass('home-hero__card--back');
    });

    it('holds the cards still while one has keyboard focus', () => {
      render(<HomeHeroCards />);

      act(() => { screen.getAllByRole('link')[0].focus(); });
      act(() => { jest.advanceTimersByTime(9000); });

      expect(screen.getAllByRole('link')[0]).toHaveClass('home-hero__card--front');
    });
  });

  it('renders a single card without crashing', () => {
    mockUseHeroCourses.mockReturnValue({ data: [courseA], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    // With nothing to sit behind, the only card is the front one.
    expect(screen.getByRole('link')).toHaveClass('home-hero__card--front');
  });

  it('renders nothing when no courses come back', () => {
    mockUseHeroCourses.mockReturnValue({ data: [], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    expect(screen.queryByTestId('home-hero-cards')).not.toBeInTheDocument();
  });

  it('renders nothing while loading, so the hero does not flash a skeleton', () => {
    mockUseHeroCourses.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    render(<HomeHeroCards />);

    expect(screen.queryByTestId('home-hero-cards')).not.toBeInTheDocument();
  });

  it('stays silent on error rather than showing an error state', () => {
    mockUseHeroCourses.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    render(<HomeHeroCards />);

    expect(screen.queryByTestId('home-hero-cards')).not.toBeInTheDocument();
  });

  it('never shows more than two cards', () => {
    mockUseHeroCourses.mockReturnValue({
      data: [courseA, courseB, { ...courseA, courseId: 'course-v1:Org+C+2026' }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('shows the provider logo when there is one', () => {
    mockUseHeroCourses.mockReturnValue({ data: [courseA], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    expect(screen.getByAltText(`${courseA.providerName} logo`)).toHaveAttribute('src', courseA.providerLogo);
  });

  it('falls back to provider initials when there is no logo', () => {
    mockUseHeroCourses.mockReturnValue({ data: [courseB], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    // "Kagyu Yeshe" -> "KY"
    expect(screen.getByText('KY')).toBeInTheDocument();
    expect(screen.queryByAltText(`${courseB.providerName} logo`)).not.toBeInTheDocument();
  });

  it('flags a course the staff marked as new', () => {
    mockUseHeroCourses.mockReturnValue({
      data: [{ ...courseA, isNew: true }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    expect(screen.getByText(messages.newCourse.defaultMessage)).toBeInTheDocument();
  });

  it('wraps the ribbon band in its clipping window', () => {
    mockUseHeroCourses.mockReturnValue({
      data: [{ ...courseA, isNew: true }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    // Load-bearing nesting: the outer element is the square window whose
    // `overflow: hidden` trims the rotated band to the corner. Flatten these
    // into one element and the band juts out across the whole card.
    expect(screen.getByText(messages.newCourse.defaultMessage).parentElement)
      .toHaveClass('home-hero__card-ribbon');
  });

  it('leaves the flag off a course that is not new', () => {
    mockUseHeroCourses.mockReturnValue({ data: [courseA], isLoading: false, isError: false });

    render(<HomeHeroCards />);

    expect(screen.queryByText(messages.newCourse.defaultMessage)).not.toBeInTheDocument();
  });

  it('links a curated pick the visitor is not enrolled in to the in-app about page', () => {
    mockUseHeroCourses.mockReturnValue({
      data: [{ ...courseA, isEnrolled: false }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    expect(screen.getByRole('link')).toHaveAttribute('href', `/courses/${courseA.courseId}/about`);
  });

  it('links an enrolled course into the courseware on the LMS', () => {
    mockUseHeroCourses.mockReturnValue({
      data: [{ ...courseA, isEnrolled: true }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${getConfig().LMS_BASE_URL}/courses/${courseA.courseId}/course/`,
    );
  });

  it('links a signed-in learner\'s unenrolled curated pick to the about page, not the courseware', () => {
    // The regression case this whole change exists for: a signed-in learner
    // must not be sent into a course they haven't joined.
    mockUseHeroCourses.mockReturnValue({
      data: [{ ...courseA, isEnrolled: false }, { ...courseB, isEnrolled: true }],
      isLoading: false,
      isError: false,
    });

    render(<HomeHeroCards />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', `/courses/${courseA.courseId}/about`);
    expect(links[1]).toHaveAttribute(
      'href',
      `${getConfig().LMS_BASE_URL}/courses/${courseB.courseId}/course/`,
    );
  });
});
