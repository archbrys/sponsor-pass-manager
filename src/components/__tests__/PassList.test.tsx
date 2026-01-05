import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PassList } from '../PassList';
import type { SponsorPass } from '@/types';

// Mock the utils module
vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils');
  return {
    ...actual,
    formatDateCET: (date: string) => new Date(date).toLocaleDateString(),
  };
});

describe('PassList', () => {
  const mockPasses: SponsorPass[] = [
    {
      id: 1,
      sponsor: 1,
      sponsorName: 'Acme Corp',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      status: 'active',
      expiresAt: '2026-12-31T00:00:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      revokedAt: null,
    },
    {
      id: 2,
      sponsor: 1,
      sponsorName: 'Acme Corp',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      status: 'revoked',
      expiresAt: null,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      revokedAt: '2025-01-02T00:00:00Z',
    },
  ];

  const defaultProps = {
    passes: mockPasses,
    totalPasses: 2,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
    includeRevoked: false,
    onIncludeRevokedChange: vi.fn(),
    onRevoke: vi.fn(),
    onPageChange: vi.fn(),
  };

  it('renders loading state when isLoading is true', () => {
    render(<PassList {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading passes...')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    render(<PassList {...defaultProps} error="Failed to load passes" />);
    
    expect(screen.getByText('Failed to load passes')).toBeInTheDocument();
  });

  it('renders title and total count', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('Sponsor Passes')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders show revoked passes checkbox', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('Show Revoked Passes')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders empty state when no passes', () => {
    render(<PassList {...defaultProps} passes={[]} totalPasses={0} />);
    
    expect(screen.getByText('No passes found for this sponsor.')).toBeInTheDocument();
  });

  it('renders table with all passes', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Expires At')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders active badge for active passes', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('✓ Active')).toBeInTheDocument();
  });

  it('renders revoked badge for revoked passes', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('✗ Revoked')).toBeInTheDocument();
  });

  it('renders revoke button for active passes', () => {
    render(<PassList {...defaultProps} />);
    
    const revokeButtons = screen.getAllByText('Revoke');
    expect(revokeButtons).toHaveLength(1); // Only one active pass
  });

  it('does not render revoke button for revoked passes', () => {
    render(<PassList {...defaultProps} />);
    
    const revokeButtons = screen.getAllByText('Revoke');
    expect(revokeButtons).toHaveLength(1); // Not 2, since one pass is revoked
  });

  it('calls onRevoke when revoke button is clicked', async () => {
    const user = userEvent.setup();
    render(<PassList {...defaultProps} />);
    
    const revokeButton = screen.getByText('Revoke');
    await user.click(revokeButton);
    
    expect(defaultProps.onRevoke).toHaveBeenCalledWith(1, 'John Doe');
  });

  it('calls onIncludeRevokedChange when checkbox is toggled', async () => {
    const user = userEvent.setup();
    render(<PassList {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(defaultProps.onIncludeRevokedChange).toHaveBeenCalledWith(true);
  });

  it('displays "No expiration" for passes without expiry date', () => {
    render(<PassList {...defaultProps} />);
    
    expect(screen.getByText('No expiration')).toBeInTheDocument();
  });

  it('renders pagination when there are multiple pages', () => {
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} />);
    
    expect(screen.getByText('Showing 1 to 10 of 25 passes')).toBeInTheDocument();
    // Check that page number buttons are rendered (1, 2, 3)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render pagination when there is only one page', () => {
    render(<PassList {...defaultProps} totalPasses={5} pageSize={10} />);
    
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={1} />);
    
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.querySelector('.lucide-chevron-right'));
    
    if (nextButton) {
      await user.click(nextButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    }
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={2} />);
    
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons.find((btn) => btn.querySelector('.lucide-chevron-left'));
    
    if (prevButton) {
      await user.click(prevButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    }
  });

  it('disables previous button on first page', () => {
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={1} />);
    
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons.find((btn) => btn.querySelector('.lucide-chevron-left'));
    
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={3} />);
    
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.querySelector('.lucide-chevron-right'));
    
    expect(nextButton).toBeDisabled();
  });

  it('displays correct pagination range on middle page', () => {
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={2} />);
    
    expect(screen.getByText('Showing 11 to 20 of 25 passes')).toBeInTheDocument();
  });

  it('displays correct pagination range on last page with partial results', () => {
    render(<PassList {...defaultProps} totalPasses={25} pageSize={10} currentPage={3} />);
    
    expect(screen.getByText('Showing 21 to 25 of 25 passes')).toBeInTheDocument();
  });
});
