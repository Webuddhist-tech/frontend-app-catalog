import { render, screen } from '@src/setupTest';
import { LearningOutcomes } from '.';

describe('LearningOutcomes', () => {
  it('renders each learning outcome', () => {
    render(<LearningOutcomes learningInfo={['Outcome one', 'Outcome two']} />);
    expect(screen.getByText('Outcome one')).toBeInTheDocument();
    expect(screen.getByText('Outcome two')).toBeInTheDocument();
  });

  it('filters out empty outcomes', () => {
    render(<LearningOutcomes learningInfo={['Real outcome', '', '   ']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('filters out outcomes that are markup with no visible text', () => {
    render(<LearningOutcomes learningInfo={['Real outcome', '<p><br></p>']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('renders nothing when there are no outcomes', () => {
    const { container } = render(<LearningOutcomes learningInfo={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
