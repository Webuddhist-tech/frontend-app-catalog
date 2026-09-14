import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import {
  render, screen, waitFor, userEvent,
} from '@src/setupTest';
import { mockCourseAboutResponse } from '@src/__mocks__';
import { useEnrollment } from '@src/course-about/data/hooks';
import { CourseIntro } from './CourseIntro';
import messages from './messages';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@src/course-about/data/hooks', () => ({
  useEnrollment: jest.fn(),
}));

// WishlistButton (rendered alongside Enroll now for an authenticated,
// eligible visitor) fetches its own status independently of anything else
// under test here.
jest.mock('./wishlist/api', () => ({
  getWishlistStatus: jest.fn(() => Promise.resolve(false)),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}));

describe('CourseIntro', () => {
  const mockEnrollAndRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthenticatedUser as jest.Mock).mockReturnValue(null);
    (useEnrollment as jest.Mock).mockReturnValue(mockEnrollAndRedirect);
  });

  it('renders course information correctly', () => {
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    expect(screen.getByText(mockCourseAboutResponse.name)).toBeInTheDocument();
    expect(screen.getByText(mockCourseAboutResponse.org)).toBeInTheDocument();
  });

  it('does not give an English title the Tibetan line-height modifier', () => {
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    expect(screen.getByText(mockCourseAboutResponse.name)).not.toHaveClass('course-about-intro-title--tibetan');
  });

  it('gives a Tibetan title the Tibetan line-height modifier', () => {
    const tibetanTitleCourseData = {
      ...mockCourseAboutResponse,
      name: 'སངས་རྒྱས་རྒྱལ་མཚན།',
    };

    render(<CourseIntro courseAboutData={tibetanTitleCourseData} />);

    expect(screen.getByText(tibetanTitleCourseData.name)).toHaveClass('course-about-intro-title--tibetan');
  });

  it('renders enrollment button for eligible users', async () => {
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage })).toBeInTheDocument();
    });
  });

  it('handles enrollment action correctly', async () => {
    mockEnrollAndRedirect.mockResolvedValueOnce(undefined);
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    const enrollButton = await screen.findByRole('button', { name: messages.enrollNowBtn.defaultMessage });
    userEvent.click(enrollButton);

    await waitFor(() => {
      expect(mockEnrollAndRedirect).toHaveBeenCalledWith(
        mockCourseAboutResponse.id,
        `${getConfig().LMS_BASE_URL}/dashboard`,
      );
    });
  });

  it('renders enrolled status for authenticated active users', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    const enrolledCourseData = {
      ...mockCourseAboutResponse,
      enrollment: { isActive: true, mode: 'audit' },
    };

    render(<CourseIntro courseAboutData={enrolledCourseData} />);

    await waitFor(() => {
      expect(screen.getByText(messages.statusMessageEnrolled.defaultMessage)).toBeInTheDocument();
    });
  });

  it('handles authenticated user correctly', async () => {
    const mockUser = { username: 'testuser' };
    (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUser);

    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    await waitFor(() => {
      expect(screen.getByRole('button', {
        name: messages.enrollNowBtn.defaultMessage,
      })).toBeInTheDocument();
    });
  });
});
