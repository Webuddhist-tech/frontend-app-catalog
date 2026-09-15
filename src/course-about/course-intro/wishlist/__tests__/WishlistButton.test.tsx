import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import {
  render, screen, waitFor, userEvent,
} from '@src/setupTest';
import messages from '../messages';
import { getWishlistStatus, addToWishlist, removeFromWishlist } from '../api';
import { WishlistButton } from '../WishlistButton';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../api', () => ({
  getWishlistStatus: jest.fn(),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}));

const mockCourseId = 'course-v1:TestX+Test101+2023';

describe('WishlistButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getWishlistStatus as jest.Mock).mockResolvedValue(false);
  });

  it('renders nothing for a logged-out visitor', () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue(null);
    const { container } = render(<WishlistButton courseId={mockCourseId} />);

    expect(container.firstChild).toBeNull();
    expect(getWishlistStatus).not.toHaveBeenCalled();
  });

  it('renders the Wishlist label for an authenticated user not yet wishlisting the course', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    render(<WishlistButton courseId={mockCourseId} />);

    await waitFor(() => expect(getWishlistStatus).toHaveBeenCalledWith(mockCourseId));

    const button = screen.getByRole('button', { name: messages.wishlistBtn.defaultMessage });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the Wishlisted label when the course is already on the wishlist', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    (getWishlistStatus as jest.Mock).mockResolvedValue(true);
    render(<WishlistButton courseId={mockCourseId} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: messages.wishlistedBtn.defaultMessage })).toBeInTheDocument();
    });
  });

  it('adds the course to the wishlist and flips the label when clicked', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    (addToWishlist as jest.Mock).mockResolvedValue({});
    const user = userEvent.setup();
    render(<WishlistButton courseId={mockCourseId} />);

    const button = await screen.findByRole('button', { name: messages.wishlistBtn.defaultMessage });
    await user.click(button);

    await waitFor(() => {
      expect(addToWishlist).toHaveBeenCalledWith(mockCourseId);
      expect(screen.getByRole('button', { name: messages.wishlistedBtn.defaultMessage })).toBeInTheDocument();
    });
  });

  it('removes the course from the wishlist and flips the label back when clicked again', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    (getWishlistStatus as jest.Mock).mockResolvedValue(true);
    (removeFromWishlist as jest.Mock).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<WishlistButton courseId={mockCourseId} />);

    const button = await screen.findByRole('button', { name: messages.wishlistedBtn.defaultMessage });
    await user.click(button);

    await waitFor(() => {
      expect(removeFromWishlist).toHaveBeenCalledWith(mockCourseId);
      expect(screen.getByRole('button', { name: messages.wishlistBtn.defaultMessage })).toBeInTheDocument();
    });
  });

  it('reverts the label if the add request fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    (addToWishlist as jest.Mock).mockRejectedValue(new Error('network error'));
    const user = userEvent.setup();
    render(<WishlistButton courseId={mockCourseId} />);

    const button = await screen.findByRole('button', { name: messages.wishlistBtn.defaultMessage });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: messages.wishlistBtn.defaultMessage })).toBeInTheDocument();
    });
  });
});
