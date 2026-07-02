import { render, screen } from '@src/setupTest';
import messages from '../../messages';
import { STATUS_MESSAGE_VARIANTS } from '../../constants';
import { EnrolledStatus } from '../EnrolledStatus';

describe('EnrolledStatus', () => {
  const defaultProps = {
    courseId: 'test-course-123',
    enrollmentMode: 'audit',
  };

  it('renders enrollment success status message', () => {
    render(<EnrolledStatus {...defaultProps} />);
    expect(screen.getByText(messages.statusMessageEnrolled.defaultMessage)).toBeInTheDocument();
  });

  it('always renders the view course link', () => {
    render(<EnrolledStatus {...defaultProps} />);

    const viewCourseBtnLink = screen.getByRole('link', {
      name: messages.viewCourseBtn.defaultMessage,
    });
    expect(viewCourseBtnLink).toHaveAttribute('href', expect.stringContaining(defaultProps.courseId));
  });

  it('renders status message with success variant', () => {
    render(<EnrolledStatus {...defaultProps} />);

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toHaveClass(`course-about-status-banner--${STATUS_MESSAGE_VARIANTS.SUCCESS}`);
  });

  it('renders the view course link with the solid teal style', () => {
    render(<EnrolledStatus {...defaultProps} />);

    const viewCourseBtnLink = screen.getByRole('link', {
      name: messages.viewCourseBtn.defaultMessage,
    });
    expect(viewCourseBtnLink).toHaveClass('btn-secondary');
  });

  it('renders the purchased message for a verified enrollment', () => {
    render(<EnrolledStatus {...defaultProps} enrollmentMode="verified" />);

    expect(screen.getByText(messages.statusMessagePurchased.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByText(messages.statusMessageEnrolled.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders both status message and view course button', () => {
    render(<EnrolledStatus {...defaultProps} />);

    expect(screen.getByText(messages.statusMessageEnrolled.defaultMessage)).toBeInTheDocument();

    const viewCourseBtnLink = screen.getByRole('link', {
      name: messages.viewCourseBtn.defaultMessage,
    });
    expect(viewCourseBtnLink).toHaveAttribute('href', expect.stringContaining(defaultProps.courseId));
  });
});
