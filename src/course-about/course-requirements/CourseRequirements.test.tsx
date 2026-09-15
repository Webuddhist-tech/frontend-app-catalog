import { render, screen } from '@src/setupTest';
import { CourseRequirements } from '.';

describe('CourseRequirements', () => {
  it('renders the requirements content when provided', () => {
    render(<CourseRequirements requirements="<p>Completion of an intro course</p>" />);
    expect(screen.getByText('Completion of an intro course')).toBeInTheDocument();
  });

  it('renders nothing when requirements is empty', () => {
    const { container } = render(<CourseRequirements requirements="   " />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when requirements is null', () => {
    const { container } = render(<CourseRequirements requirements={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when requirements is markup with no visible text', () => {
    const { container } = render(<CourseRequirements requirements="<p></p>" />);
    expect(container.firstChild).toBeNull();
  });
});
