import { getConfig } from '@edx/frontend-platform';

import { render, screen } from '@src/setupTest';
import { CourseDescription } from '.';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockGetConfig = getConfig as jest.Mock;

describe('CourseDescription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConfig.mockReturnValue({ LMS_BASE_URL: 'http://localhost:18000' });
  });

  it('renders the description content when provided', () => {
    render(<CourseDescription description="<p>Detailed course description</p>" />);
    expect(screen.getByText('Detailed course description')).toBeInTheDocument();
  });

  it('renders nothing when description is empty', () => {
    const { container } = render(<CourseDescription description="   " />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when description is null', () => {
    const { container } = render(<CourseDescription description={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when description is markup with no visible text', () => {
    const { container } = render(<CourseDescription description="<p><br></p>" />);
    expect(container.firstChild).toBeNull();
  });
});
