import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SponsorSelector } from '../SponsorSelector';
import type { Sponsor } from '@/types';

// Mock FrontierSDK
vi.mock('@frontiertower/frontier-sdk', () => ({
  FrontierSDK: vi.fn(),
}));

describe('SponsorSelector', () => {
  const mockSponsors: Sponsor[] = [
    {
      id: 1,
      name: 'Acme Corp',
      dailyRate: '100.00',
      notes: 'Test sponsor 1',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'TechCo',
      dailyRate: '150.00',
      notes: 'Test sponsor 2',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
  ];

  const mockSdk = {} as any;

  const defaultProps = {
    sdk: mockSdk,
    sponsors: mockSponsors,
    selectedSponsorId: null,
    onSponsorChange: vi.fn(),
    onCreatePassClick: vi.fn(),
  };

  it('renders sponsor selection label and description', () => {
    render(<SponsorSelector {...defaultProps} />);
    
    expect(screen.getByText('Select Sponsor')).toBeInTheDocument();
    expect(screen.getByText('Choose a sponsor to view and manage their passes')).toBeInTheDocument();
  });

  it('renders select trigger with placeholder when no sponsor selected', () => {
    render(<SponsorSelector {...defaultProps} />);
    
    expect(screen.getByText('Choose a sponsor...')).toBeInTheDocument();
  });

  it('does not show create button when no sponsor is selected', () => {
    render(<SponsorSelector {...defaultProps} />);
    
    expect(screen.queryByText('Create New Pass')).not.toBeInTheDocument();
  });

  it('shows create button when sponsor is selected', () => {
    render(<SponsorSelector {...defaultProps} selectedSponsorId={1} />);
    
    expect(screen.getByText('Create New Pass')).toBeInTheDocument();
  });

  it('calls onCreatePassClick when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<SponsorSelector {...defaultProps} selectedSponsorId={1} />);
    
    const createButton = screen.getByText('Create New Pass');
    await user.click(createButton);
    
    expect(defaultProps.onCreatePassClick).toHaveBeenCalledTimes(1);
  });

  it('displays selected sponsor information when a sponsor is selected', () => {
    render(<SponsorSelector {...defaultProps} selectedSponsorId={1} />);
    
    // The component shows sponsor details in CardContent when selected
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders all sponsors in the select dropdown', async () => {
    const user = userEvent.setup();
    render(<SponsorSelector {...defaultProps} />);
    
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    
    // Check if both sponsors appear in the options
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('TechCo')).toBeInTheDocument();
  });

  it('calls onSponsorChange with correct ID when sponsor is selected', async () => {
    const user = userEvent.setup();
    render(<SponsorSelector {...defaultProps} />);
    
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    
    const option = screen.getByText('TechCo');
    await user.click(option);
    
    expect(defaultProps.onSponsorChange).toHaveBeenCalledWith(2);
  });
});
