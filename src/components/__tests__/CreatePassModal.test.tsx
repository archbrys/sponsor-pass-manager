import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePassModal } from '../CreatePassModal';

describe('CreatePassModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with title and description', () => {
    render(<CreatePassModal {...defaultProps} />);
    
    expect(screen.getByText('Create New Sponsor Pass')).toBeInTheDocument();
    expect(screen.getByText(/Fill in the details to create a new sponsor pass/)).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<CreatePassModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
  });

  it('renders required asterisks for required fields', () => {
    render(<CreatePassModal {...defaultProps} />);
    
    const requiredMarkers = screen.getAllByText('*');
    expect(requiredMarkers.length).toBeGreaterThan(0);
  });

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup();
    render(<CreatePassModal {...defaultProps} />);
    
    const firstNameInput = screen.getByLabelText(/First Name/);
    const lastNameInput = screen.getByLabelText(/Last Name/);
    const emailInput = screen.getByLabelText(/Email/);
    
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john@example.com');
    
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('submits form with correct data when all required fields are filled', async () => {
    const user = userEvent.setup();
    render(<CreatePassModal {...defaultProps} />);
    
    await user.type(screen.getByLabelText(/First Name/), 'John');
    await user.type(screen.getByLabelText(/Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    
    const submitButton = screen.getByText('Create Pass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });
  });

  it('includes expiry date in submission when provided', async () => {
    const user = userEvent.setup();
    render(<CreatePassModal {...defaultProps} />);
    
    await user.type(screen.getByLabelText(/First Name/), 'John');
    await user.type(screen.getByLabelText(/Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    
    const expiryInput = screen.getByLabelText(/Expires At/);
    await user.type(expiryInput, '2026-12-31');
    
    const submitButton = screen.getByText('Create Pass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          expiresAt: expect.any(String),
        })
      );
    });
  });

  it('resets form and closes modal after successful submission', async () => {
    const user = userEvent.setup();
    render(<CreatePassModal {...defaultProps} />);
    
    await user.type(screen.getByLabelText(/First Name/), 'John');
    await user.type(screen.getByLabelText(/Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    
    const submitButton = screen.getByText('Create Pass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    const slowSubmit = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));
    render(<CreatePassModal {...defaultProps} onSubmit={slowSubmit} />);
    
    await user.type(screen.getByLabelText(/First Name/), 'John');
    await user.type(screen.getByLabelText(/Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    
    const submitButton = screen.getByText('Create Pass');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('shows alert and does not close modal on submission error', async () => {
    const user = userEvent.setup();
    // Mock alert using vi.stubGlobal for happy-dom compatibility
    const alertMock = vi.fn();
    vi.stubGlobal('alert', alertMock);
    
    const failingSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<CreatePassModal {...defaultProps} onSubmit={failingSubmit} />);
    
    await user.type(screen.getByLabelText(/First Name/), 'John');
    await user.type(screen.getByLabelText(/Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    
    const submitButton = screen.getByText('Create Pass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to create pass: Network error');
    });
    
    expect(defaultProps.onOpenChange).not.toHaveBeenCalledWith(false);
    
    vi.unstubAllGlobals();
  });

  it('renders cancel button', () => {
    render(<CreatePassModal {...defaultProps} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CreatePassModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });
});
