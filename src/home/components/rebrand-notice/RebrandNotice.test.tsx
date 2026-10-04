import { fireEvent } from '@testing-library/react';

import { render, screen, cleanup } from '@src/setupTest';
import RebrandNotice from './RebrandNotice';

import messages from './messages';

const notice = () => screen.queryByRole('complementary');
const closeButton = () => screen.getByRole('button', { name: messages.close.defaultMessage });

afterEach(() => {
  cleanup();
});

describe('<RebrandNotice />', () => {
  it('announces the rename and that nothing else changed', () => {
    render(<RebrandNotice />);

    expect(screen.getByText(messages.title.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.body.defaultMessage)).toBeInTheDocument();
    expect(notice()).toHaveAccessibleName(messages.title.defaultMessage);
  });

  it('collapses when closed and is removed once the animation ends', () => {
    render(<RebrandNotice />);

    fireEvent.click(closeButton());
    expect(notice()).toHaveClass('rebrand-notice--leaving');

    fireEvent.animationEnd(notice()!);
    expect(notice()).not.toBeInTheDocument();
  });

  it('ignores the entrance animation ending', () => {
    render(<RebrandNotice />);

    fireEvent.animationEnd(notice()!);
    expect(notice()).toBeInTheDocument();
  });

  it('ignores an animation ending inside it while closing', () => {
    render(<RebrandNotice />);
    fireEvent.click(closeButton());

    fireEvent.animationEnd(screen.getByText(messages.title.defaultMessage));
    expect(notice()).toBeInTheDocument();
  });

  it('shows again on the next page load after being closed', () => {
    render(<RebrandNotice />);
    fireEvent.click(closeButton());
    fireEvent.animationEnd(notice()!);
    cleanup();

    render(<RebrandNotice />);
    expect(notice()).toBeInTheDocument();
  });
});
