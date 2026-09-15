import { render, screen } from '@src/setupTest';
import { Instructors } from '.';
import type { Instructor } from '../types';

const buildInstructor = (overrides: Partial<Instructor> = {}): Instructor => ({
  name: 'Jane Doe',
  title: 'Professor',
  organization: 'openedX University',
  image: 'https://example.com/jane.jpg',
  bio: '<p>Jane teaches things.</p>',
  ...overrides,
});

describe('Instructors', () => {
  it('renders instructor name, title/org and bio', () => {
    render(<Instructors instructorInfo={[buildInstructor()]} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Professor — openedX University')).toBeInTheDocument();
    expect(screen.getByText('Jane teaches things.')).toBeInTheDocument();
  });

  it('renders the instructor image with alt text', () => {
    render(<Instructors instructorInfo={[buildInstructor()]} />);
    expect(screen.getByAltText('Photo of Jane Doe')).toHaveAttribute(
      'src',
      'https://example.com/jane.jpg',
    );
  });

  it('skips instructors without a name or bio', () => {
    render(<Instructors instructorInfo={[buildInstructor({ name: '', bio: '' })]} />);
    expect(screen.queryByText('Professor — openedX University')).not.toBeInTheDocument();
  });

  it('skips an instructor whose name and bio are both blank markup', () => {
    const { container } = render(
      <Instructors instructorInfo={[buildInstructor({ name: '   ', bio: '<p><br></p>' })]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('keeps an instructor with a name but omits an empty-markup bio', () => {
    render(<Instructors instructorInfo={[buildInstructor({ bio: '<p></p>' })]} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(document.querySelector('.course-about-instructor__bio')).not.toBeInTheDocument();
  });

  it('renders nothing when there are no instructors', () => {
    const { container } = render(<Instructors instructorInfo={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
