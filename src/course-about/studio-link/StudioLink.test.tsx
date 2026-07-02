import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { render, screen } from '@src/setupTest';
import messages from '../messages';
import { StudioLink } from '.';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockGetAuthenticatedUser = getAuthenticatedUser as jest.Mock;
const mockGetConfig = getConfig as jest.Mock;

const mockCourseId = 'course-v1:TestX+Test101+2023';

describe('StudioLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConfig.mockReturnValue({ STUDIO_BASE_URL: process.env.STUDIO_BASE_URL });
  });

  it('renders the Studio link for global staff users', () => {
    mockGetAuthenticatedUser.mockReturnValue({ administrator: true });
    render(<StudioLink courseId={mockCourseId} />);

    const studioButton = screen.getByRole('link', { name: messages.viewAboutPageInStudio.defaultMessage });
    expect(studioButton).toBeInTheDocument();
    expect(studioButton).toHaveAttribute(
      'href',
      `${getConfig().STUDIO_BASE_URL}/settings/details/${mockCourseId}`,
    );
    // The divider line above the button lives on this wrapper, not on a
    // sibling-combinator rule elsewhere, so it renders every time this does.
    expect(studioButton.closest('.course-about-studio-link-section')).toBeInTheDocument();
  });

  it('renders nothing for non-staff users', () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    const { container } = render(<StudioLink courseId={mockCourseId} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an authenticated user without administrator role', () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser', administrator: false });
    const { container } = render(<StudioLink courseId={mockCourseId} />);

    expect(container.firstChild).toBeNull();
  });
});
