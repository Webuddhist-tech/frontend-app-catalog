import { ROUTES } from '@src/routes';
import {
  render, userEvent, cleanup, screen, reactRouter,
} from '@src/setupTest';
import { useHeroCourses } from '@src/data/hero-courses/hooks';
import sharedMessages from '@src/generic/messages';
import HomeBanner from './HomeBanner';

import messages from './messages';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    ENABLE_COURSE_DISCOVERY: process.env.ENABLE_COURSE_DISCOVERY,
  })),
  ensureConfig: jest.fn(),
}));

jest.mock('@src/data/hero-courses/hooks', () => ({
  useHeroCourses: jest.fn(),
}));

const mockUseHeroCourses = useHeroCourses as jest.Mock;

beforeEach(() => {
  mockUseHeroCourses.mockReturnValue({ data: [], isLoading: false, isError: false });
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('<HomeBanner />', () => {
  it('renders search input and triggers navigate on Enter key press', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

    render(<HomeBanner />);
    const input = screen.getByPlaceholderText(sharedMessages.courseSearchPlaceholder.defaultMessage);

    await userEvent.type(input, 'some_text{enter}');

    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.COURSES}?search_query=some_text`);
  });

  it('no longer renders the promo video button', () => {
    render(<HomeBanner />);

    expect(screen.queryByRole('button', { name: messages.videoButton.defaultMessage })).not.toBeInTheDocument();
  });

  it('greets a signed-out visitor with the site name', () => {
    render(<HomeBanner />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to');
    expect(screen.getByText(messages.eyebrowSignedOut.defaultMessage)).toBeInTheDocument();
  });
});
