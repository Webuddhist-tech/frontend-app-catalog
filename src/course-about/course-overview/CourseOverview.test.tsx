import { getConfig } from '@edx/frontend-platform';

import { render, screen } from '@src/setupTest';
import messages from '../messages';
import { CourseOverview } from '.';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockGetConfig = getConfig as jest.Mock;

const mockCourseId = 'course-v1:TestX+Test101+2023';

describe('CourseOverview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConfig.mockReturnValue({ LMS_BASE_URL: process.env.LMS_BASE_URL });
  });

  describe('Content rendering', () => {
    it('renders overview content when provided', () => {
      const overviewText = 'Course overview content';
      const overviewData = `<p>${overviewText}</p>`;

      render(<CourseOverview overviewData={overviewData} courseId={mockCourseId} />);
      expect(screen.getByText(overviewText)).toBeInTheDocument();
    });

    it('renders the section heading when content is provided', () => {
      render(<CourseOverview overviewData="<p>Content</p>" courseId={mockCourseId} />);
      expect(screen.getByRole('heading', { name: messages.courseOverviewHeading.defaultMessage })).toBeInTheDocument();
    });

    it('renders nothing when there is no overview content', () => {
      const { container } = render(<CourseOverview overviewData="" courseId={mockCourseId} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when overview is markup with no visible text', () => {
      // A rich-text editor's saved "empty" state (e.g. an empty paragraph) is a
      // non-empty string, but nothing a visitor would actually see.
      const { container } = render(<CourseOverview overviewData="<p><br></p>" courseId={mockCourseId} />);

      expect(container.firstChild).toBeNull();
    });

    it('processes overview content to replace image paths', () => {
      const overviewData = '<img src="/static/images/test.jpg" alt="Test" />';
      render(<CourseOverview overviewData={overviewData} courseId={mockCourseId} />);

      const img = screen.getByAltText('Test');
      expect(img).toHaveAttribute('src', `${getConfig().LMS_BASE_URL}/static/images/test.jpg`);
    });

    it('processes overview content with asset paths', () => {
      const overviewData = '<img src="/asset/test.jpg" alt="Test" />';
      render(<CourseOverview overviewData={overviewData} courseId={mockCourseId} />);

      const img = screen.getByAltText('Test');
      expect(img).toHaveAttribute('src', `${getConfig().LMS_BASE_URL}/asset/test.jpg`);
    });
  });
});
