import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PassFilters } from '../PassFilters';

describe('PassFilters', () => {
  const defaultProps = {
    includeRevoked: false,
    onIncludeRevokedChange: vi.fn(),
  };

  it('renders checkbox with correct label', () => {
    render(<PassFilters {...defaultProps} />);
    
    expect(screen.getByText('Show Revoked Passes')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox is unchecked when includeRevoked is false', () => {
    render(<PassFilters {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox is checked when includeRevoked is true', () => {
    render(<PassFilters {...defaultProps} includeRevoked={true} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onIncludeRevokedChange with true when checkbox is clicked to check', async () => {
    const user = userEvent.setup();
    render(<PassFilters {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(defaultProps.onIncludeRevokedChange).toHaveBeenCalledWith(true);
  });

  it('calls onIncludeRevokedChange when label is clicked', async () => {
    const user = userEvent.setup();
    render(<PassFilters {...defaultProps} />);
    
    const label = screen.getByText('Show Revoked Passes');
    await user.click(label);
    
    expect(defaultProps.onIncludeRevokedChange).toHaveBeenCalled();
  });

  it('has accessible label connected to checkbox', () => {
    render(<PassFilters {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Show Revoked Passes');
    
    expect(checkbox).toHaveAttribute('id', 'include-revoked');
    expect(label).toHaveAttribute('for', 'include-revoked');
  });
});
