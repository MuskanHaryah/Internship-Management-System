import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../components/ui/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-card">Content</Card>
    );
    const card = container.firstChild;
    expect(card).toHaveClass('custom-card');
  });

  it('has default styles', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('dark:bg-gray-800');
  });

  it('renders with hover effects', () => {
    const { container } = render(<Card hover>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-lg');
  });
});
