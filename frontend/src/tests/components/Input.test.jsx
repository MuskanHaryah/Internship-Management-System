import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/ui/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input label="Test" onChange={handleChange} />);
    const input = screen.getByLabelText('Test');
    
    await user.type(input, 'Hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('applies error styles when error exists', () => {
    const { container } = render(<Input label="Email" error="Invalid" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('renders as textarea when type is textarea', () => {
    render(<Input label="Description" type="textarea" />);
    expect(screen.getByLabelText('Description').tagName).toBe('TEXTAREA');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Test" disabled />);
    expect(screen.getByLabelText('Test')).toBeDisabled();
  });

  it('shows required indicator', () => {
    render(<Input label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
