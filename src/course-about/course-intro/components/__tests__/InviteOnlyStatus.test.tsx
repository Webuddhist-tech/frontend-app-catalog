import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import {
  render, screen, userEvent, waitFor,
} from '@src/setupTest';
import messages from '../../messages';
import { STATUS_MESSAGE_VARIANTS } from '../../constants';
import { getInviteInstructions } from '../../invite-instructions/api';
import { InviteOnlyStatus } from '../InviteOnlyStatus';

// WishlistButton (rendered alongside the banner) checks auth on its own —
// mocked here to null so it renders nothing and this suite can stay focused
// on the banner/modal; WishlistButton has its own dedicated tests.
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(() => null),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../../invite-instructions/api', () => ({
  getInviteInstructions: jest.fn(),
}));

const mockCourseId = 'course-v1:TestX+Test101+2023';

describe('InviteOnlyStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getInviteInstructions as jest.Mock).mockResolvedValue(null);
  });

  it('renders the invitation-only banner', () => {
    render(<InviteOnlyStatus courseId={mockCourseId} />);

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.INFO}`);
    expect(statusMessage).toHaveTextContent(messages.statusMessageEnrollmentInvitationOnly.defaultMessage);
  });

  it('renders no Wishlist button for a logged-out visitor', () => {
    render(<InviteOnlyStatus courseId={mockCourseId} />);
    expect(getAuthenticatedUser).toHaveBeenCalled();
  });

  it('does not fetch invite instructions until the modal is opened', () => {
    render(<InviteOnlyStatus courseId={mockCourseId} />);
    expect(getInviteInstructions).not.toHaveBeenCalled();
  });

  it('opens the "how to get an invite" modal on click, fetching instructions for the course', async () => {
    const user = userEvent.setup();
    render(<InviteOnlyStatus courseId={mockCourseId} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getAllByText(messages.inviteInstructionsModalTitle.defaultMessage).length).toBeGreaterThan(0);
    expect(getInviteInstructions).toHaveBeenCalledWith(mockCourseId);
  });

  it('does not re-fetch instructions on a second open', async () => {
    const user = userEvent.setup();
    render(<InviteOnlyStatus courseId={mockCourseId} />);
    const infoButton = screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage });

    await user.click(infoButton);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await user.click(infoButton);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    expect(getInviteInstructions).toHaveBeenCalledTimes(1);
  });

  it('falls back to the default placeholder message when there is no partner message', async () => {
    (getInviteInstructions as jest.Mock).mockResolvedValue(null);
    const user = userEvent.setup();
    render(<InviteOnlyStatus courseId={mockCourseId} />);

    await user.click(screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText(/Please contact your program administrator/)).toBeInTheDocument();
  });

  it('renders the fetched partner message as HTML when present', async () => {
    (getInviteInstructions as jest.Mock).mockResolvedValue('<p>Email <strong>admissions@example.com</strong></p>');
    const user = userEvent.setup();
    render(<InviteOnlyStatus courseId={mockCourseId} />);

    await user.click(screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('admissions@example.com').tagName).toBe('STRONG');
    expect(screen.queryByText(/Please contact your program administrator/)).not.toBeInTheDocument();
  });

  it('falls back to the default placeholder message when the fetch fails', async () => {
    (getInviteInstructions as jest.Mock).mockRejectedValue(new Error('network error'));
    const user = userEvent.setup();
    render(<InviteOnlyStatus courseId={mockCourseId} />);

    await user.click(screen.getByRole('button', { name: messages.howToGetInviteBtn.defaultMessage }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText(/Please contact your program administrator/)).toBeInTheDocument();
  });
});
