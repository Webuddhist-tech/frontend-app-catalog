import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import {
  cleanup, renderHook, render, screen, waitFor,
} from '@src/setupTest';
import { mockCourseAboutResponse } from '@src/__mocks__';
import { STATUS_MESSAGE_VARIANTS } from '../../constants';
import { getLearningHomePageUrl } from '../../utils';
import messages from '../../messages';
import wishlistMessages from '../../wishlist/messages';
import { getWishlistStatus } from '../../wishlist/api';
import { useEnrollmentStatus } from '../useEnrollmentStatus';

// WishlistButton and InviteOnlyStatus's info button both check auth/fetch
// their own data independently of the props passed into this hook.
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(() => null),
}));

jest.mock('../../wishlist/api', () => ({
  getWishlistStatus: jest.fn(() => Promise.resolve(false)),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}));

const wrapper = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe('useEnrollmentStatus', () => {
  const mockCourseAboutData = {
    ...mockCourseAboutResponse,
    showCoursewareLink: true,
  };

  const mockProps = {
    courseAboutData: mockCourseAboutData,
    enrollmentError: null,
    authenticatedUser: null,
    isEnrollmentPending: false,
    handleChangeEnrollment: jest.fn(),
    handleEcommerceCheckout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    // clearAllMocks resets call history but not an explicit mockReturnValue
    // set inside a test — restore the anonymous default so one test's
    // override of getAuthenticatedUser can't leak into the next.
    (getAuthenticatedUser as jest.Mock).mockReturnValue(null);
  });

  it('renders enrollment error status message when there is an error', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      enrollmentError: messages.statusMessageEnrollmentError.defaultMessage,
    }), { wrapper });

    render(result.current.renderStatusContent());

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.DANGER}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageEnrollmentError.defaultMessage);
  });

  it('renders enrolled status message for authenticated active users', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      authenticatedUser: { username: 'testuser' },
      courseAboutData: {
        ...mockCourseAboutData,
        enrollment: { isActive: true, mode: 'audit' },
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const statusMessage = screen.getByRole('status');

    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.SUCCESS}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageEnrolled.defaultMessage);

    const viewCourseButton = screen.getByRole('link', { name: messages.viewCourseBtn.defaultMessage });
    expect(viewCourseButton).toHaveAttribute('href', getLearningHomePageUrl(mockCourseAboutResponse.id));
    expect(viewCourseButton).toHaveClass('btn-secondary');
  });

  it('renders the purchased message and no Wishlist button for a verified enrollment', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      authenticatedUser: { username: 'testuser' },
      courseAboutData: {
        ...mockCourseAboutData,
        enrollment: { isActive: true, mode: 'verified' },
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    expect(screen.getByText(messages.statusMessagePurchased.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: wishlistMessages.wishlistBtn.defaultMessage })).not.toBeInTheDocument();
  });

  it('renders full course status message when course is full', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      courseAboutData: {
        ...mockCourseAboutData,
        isCourseFull: true,
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.INFO}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageFull.defaultMessage);
  });

  it('renders invitation only status message when course is invitation only and user cannot enroll', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      courseAboutData: {
        ...mockCourseAboutData,
        invitationOnly: true,
        canEnroll: false,
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.INFO}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageEnrollmentInvitationOnly.defaultMessage);
    expect(screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage })).toBeInTheDocument();
  });

  it('renders enrollment closed status message when course is not shib and user cannot enroll', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      courseAboutData: {
        ...mockCourseAboutData,
        isShibCourse: false,
        canEnroll: false,
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.INFO}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageEnrollmentClosed.defaultMessage);
  });

  it('renders enrollment button for eligible users, with no Wishlist button for a logged-out visitor', () => {
    const { result } = renderHook(() => useEnrollmentStatus(mockProps), { wrapper });

    render(result.current.renderStatusContent());

    const enrollButton = screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage });
    expect(enrollButton).toHaveClass('btn-primary');
    expect(enrollButton).toHaveTextContent(messages.enrollNowBtn.defaultMessage);
    expect(screen.queryByRole('button', { name: wishlistMessages.wishlistBtn.defaultMessage })).not.toBeInTheDocument();
  });

  it('renders a Wishlist button alongside Enroll now for an authenticated, eligible visitor', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });

    const { result } = renderHook(() => useEnrollmentStatus(mockProps), { wrapper });

    render(result.current.renderStatusContent());

    expect(screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage })).toBeInTheDocument();
    await waitFor(() => expect(getWishlistStatus).toHaveBeenCalledWith(mockCourseAboutData.id));
    expect(screen.getByRole('button', { name: wishlistMessages.wishlistBtn.defaultMessage })).toBeInTheDocument();
  });

  it('renders view course button for anonymous users when course allows anonymous access', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      courseAboutData: {
        ...mockCourseAboutData,
        allowAnonymous: true,
        showCoursewareLink: true,
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const viewCourseButton = screen.getByRole('link', { name: messages.viewCourseBtn.defaultMessage });
    expect(viewCourseButton).toHaveAttribute('href', getLearningHomePageUrl(mockCourseAboutData.id));
    expect(viewCourseButton).toHaveClass('btn-secondary');
  });

  it('shows pending state on enrollment button when enrollment is pending', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      isEnrollmentPending: true,
    }), { wrapper });

    render(result.current.renderStatusContent());

    const enrollButton = screen.getByRole('button', { name: messages.enrollNowBtnPending.defaultMessage });
    expect(enrollButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles ecommerce checkout mode correctly', () => {
    const { result } = renderHook(() => useEnrollmentStatus({
      ...mockProps,
      courseAboutData: {
        ...mockCourseAboutData,
        ecommerceCheckout: true,
      },
    }), { wrapper });

    render(result.current.renderStatusContent());

    const enrollButton = screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage });
    expect(enrollButton).toHaveTextContent(messages.enrollNowBtn.defaultMessage);
  });
});
