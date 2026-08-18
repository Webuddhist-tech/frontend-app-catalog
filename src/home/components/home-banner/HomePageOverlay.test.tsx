import { AppContext } from '@edx/frontend-platform/react';

import { render, screen, cleanup } from '@src/setupTest';
import type { AuthenticatedUserTypes } from '@src/header/types';
import HomePageOverlay from './HomePageOverlay';

import messages from './messages';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ SITE_NAME: process.env.SITE_NAME })),
}));

type TestUser = Pick<AuthenticatedUserTypes, 'name' | 'username'>;

// `render` from setupTest already supplies IntlProvider, so only the user
// context has to be layered on here.
const renderWithUser = (authenticatedUser: TestUser | null) => render(
  <AppContext.Provider value={{ authenticatedUser, config: {} } as any}>
    <HomePageOverlay />
  </AppContext.Provider>,
);

const heading = () => screen.getByRole('heading', { level: 1 });

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('<HomePageOverlay />', () => {
  it('greets a signed-in learner by the first word of their name, capitalised', () => {
    renderWithUser({ name: 'lionel messi', username: 'lionelmessi' });

    expect(heading()).toHaveTextContent('Welcome back, Lionel');
    expect(screen.getByText(messages.eyebrowSignedIn.defaultMessage)).toBeInTheDocument();
  });

  it('greets a signed-in learner by username when they have no name', () => {
    renderWithUser({ name: null, username: 'a_service_account' });

    expect(heading()).toHaveTextContent('Welcome back, A_service_account');
  });

  it('shows the site name to a signed-out visitor', () => {
    renderWithUser(null);

    expect(heading()).toHaveTextContent(`Welcome to ${process.env.SITE_NAME}`);
    expect(screen.getByText(messages.eyebrowSignedOut.defaultMessage)).toBeInTheDocument();
  });

  it('puts the name in the accent element, on its own line', () => {
    renderWithUser({ name: 'Padma Dorje', username: 'padma' });

    // The heading is built with a rich-text tag rather than plain interpolation
    // so the name lands in its own element: that is what the design italicises,
    // tints, and drops onto a second line.
    expect(heading().querySelector('.home-hero__title-accent')).toHaveTextContent('Padma');
  });
});
