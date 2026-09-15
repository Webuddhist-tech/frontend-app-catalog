import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { render, screen, within } from '@src/setupTest';
import { mockCourseAboutResponse } from '@src/__mocks__';
import { ROUTES } from '@src/routes';
import SidebarDetails from '../SidebarDetails';
import messages from '../messages';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

describe('SidebarDetails', () => {
  beforeEach(() => {
    // Not under test here — StudioLink (rendered at the bottom of every
    // SidebarDetails) has its own dedicated test suite.
    (getAuthenticatedUser as jest.Mock).mockReturnValue(null);
  });

  const createCourseData = (overrides = {}) => ({
    ...mockCourseAboutResponse,
    ...overrides,
  });

  describe('Release date', () => {
    it('renders when startDateIsStillDefault is false', () => {
      const courseData = createCourseData({
        start: '2024-01-15T00:00:00Z',
        startDateIsStillDefault: false,
      });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.releaseDate.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    it('does not render when startDateIsStillDefault is true', () => {
      const courseData = createCourseData({
        start: '2024-01-15T00:00:00Z',
        startDateIsStillDefault: true,
      });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.queryByText(messages.releaseDate.defaultMessage)).not.toBeInTheDocument();
    });

    it('uses advertisedStart when start is not available', () => {
      const courseData = createCourseData({
        start: null,
        advertisedStart: '2024-02-01T00:00:00Z',
        startDateIsStillDefault: false,
      });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.releaseDate.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(/Feb 1, 2024/)).toBeInTheDocument();
    });
  });

  describe('Archive date', () => {
    it('renders when provided', () => {
      const courseData = createCourseData({ end: '2024-06-15T00:00:00Z' });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.archiveDate.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(/Jun 15, 2024/)).toBeInTheDocument();
    });

    it('does not render when not provided', () => {
      const courseData = createCourseData({ end: null });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.queryByText(messages.archiveDate.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('Effort', () => {
    it('renders when provided', () => {
      const courseData = createCourseData({ effort: '5-10 hours per week' });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.estimatedEffort.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText('5-10 hours per week')).toBeInTheDocument();
    });

    it('does not render when not provided', () => {
      const courseData = createCourseData({ effort: null });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.queryByText(messages.estimatedEffort.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('Course price', () => {
    it('renders when provided', () => {
      const courseData = createCourseData({ coursePrice: '$99' });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.price.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText('$99')).toBeInTheDocument();
    });

    it('does not render when not provided', () => {
      const courseData = createCourseData({ coursePrice: null });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.queryByText(messages.price.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('About sidebar HTML', () => {
    it('renders when provided', () => {
      const courseData = createCourseData({ aboutSidebarHtml: '<p>Extra sidebar content</p>' });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText('Extra sidebar content')).toBeInTheDocument();
    });

    it('does not render when it is markup with no visible text', () => {
      const courseData = createCourseData({ aboutSidebarHtml: '<p><br></p>' });
      const { container } = render(<SidebarDetails courseAboutData={courseData} />);

      expect(container.querySelector('.course-about-sidebar-html')).not.toBeInTheDocument();
    });
  });

  describe('Prerequisites', () => {
    const prerequisiteCourse = {
      key: 'course-v1:TestX+CS100+2023',
      display: 'Introduction to Computer Science',
    };

    it('renders when preRequisiteCourses exist', () => {
      const courseData = createCourseData({ preRequisiteCourses: [prerequisiteCourse] });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.prerequisites.defaultMessage)).toBeInTheDocument();

      const prerequisiteLinks = screen.getAllByRole('link', {
        name: prerequisiteCourse.display,
      });
      expect(prerequisiteLinks).toHaveLength(2);

      prerequisiteLinks.forEach(link => {
        expect(link).toHaveAttribute(
          'href',
          ROUTES.COURSE_ABOUT.replace(':courseId', prerequisiteCourse.key),
        );
      });
    });

    it('renders completion message', () => {
      const courseData = createCourseData({ preRequisiteCourses: [prerequisiteCourse] });
      render(<SidebarDetails courseAboutData={courseData} />);

      const expectedText = messages
        .prerequisitesCompletion.defaultMessage.replace('{prerequisite}', prerequisiteCourse.display);
      const completionMessage = screen.getByText((_, element) => element?.textContent === expectedText);
      expect(completionMessage).toBeInTheDocument();

      const prerequisiteLink = within(completionMessage).getByRole('link', {
        name: prerequisiteCourse.display,
      });
      expect(prerequisiteLink).toHaveAttribute(
        'href',
        ROUTES.COURSE_ABOUT.replace(':courseId', prerequisiteCourse.key),
      );
    });

    it('does not render when preRequisiteCourses is empty', () => {
      const courseData = createCourseData({ preRequisiteCourses: [] });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.queryByText(messages.prerequisites.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(
        messages.prerequisitesCompletion.defaultMessage.replace('{prerequisite}', prerequisiteCourse.display),
      )).not.toBeInTheDocument();
    });

    it('renders only the first prerequisite when multiple exist', () => {
      const courseData = createCourseData({
        preRequisiteCourses: [
          prerequisiteCourse,
          {
            key: 'course-v1:TestX+CS200+2023',
            display: 'Data Structures',
          },
        ],
      });
      render(<SidebarDetails courseAboutData={courseData} />);

      expect(screen.getByText(messages.prerequisites.defaultMessage)).toBeInTheDocument();

      const prerequisiteLinks = screen.getAllByRole('link');
      expect(prerequisiteLinks).toHaveLength(2);

      expect(prerequisiteLinks[0]).toHaveAttribute(
        'href',
        ROUTES.COURSE_ABOUT.replace(':courseId', prerequisiteCourse.key),
      );
      expect(prerequisiteLinks[0]).toHaveTextContent(prerequisiteCourse.display);
      expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
    });
  });

  it('renders all available details when all data is provided', () => {
    const courseData = createCourseData({
      effort: '5-10 hours per week',
      start: '2024-01-15T00:00:00Z',
      end: '2024-06-15T00:00:00Z',
      startDateIsStillDefault: false,
      coursePrice: '$99',
      preRequisiteCourses: [{
        key: 'course-v1:TestX+CS100+2023',
        display: 'Introduction to Computer Science',
      }],
    });
    render(<SidebarDetails courseAboutData={courseData} />);

    expect(screen.getByText(messages.releaseDate.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(messages.archiveDate.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(/Jun 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(messages.estimatedEffort.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(courseData.effort ?? '')).toBeInTheDocument();
    expect(screen.getByText(messages.price.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(courseData.coursePrice)).toBeInTheDocument();
    expect(screen.getByText(messages.prerequisites.defaultMessage)).toBeInTheDocument();
  });

  it('handles minimal course data', () => {
    const courseData = createCourseData({
      effort: null,
      start: null,
      end: null,
      startDateIsStillDefault: true,
      coursePrice: null,
      preRequisiteCourses: [],
    });
    render(<SidebarDetails courseAboutData={courseData} />);

    // No detail rows should be shown
    expect(screen.queryByText(messages.releaseDate.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.archiveDate.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.estimatedEffort.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.price.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.prerequisites.defaultMessage)).not.toBeInTheDocument();
  });
});
