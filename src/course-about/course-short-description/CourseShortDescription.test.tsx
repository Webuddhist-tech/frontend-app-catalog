import { render, screen } from '@src/setupTest';
import messages from '../messages';
import { CourseShortDescription } from '.';

describe('CourseShortDescription', () => {
  it('renders the heading and short description when provided', () => {
    render(<CourseShortDescription shortDescription="A quick summary of the course." />);
    expect(screen.getByRole('heading', { name: messages.courseShortDescriptionHeading.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText('A quick summary of the course.')).toBeInTheDocument();
  });

  it('renders nothing when short description is empty', () => {
    const { container } = render(<CourseShortDescription shortDescription="   " />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when short description is undefined', () => {
    const { container } = render(<CourseShortDescription />);
    expect(container.firstChild).toBeNull();
  });
});
