import type { Sponsor, SponsorPass } from '@/types';

export const mockSponsors: Sponsor[] = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    dailyRate: '$500',
    notes: 'Premium sponsor with extended access',
  },
  {
    id: 2,
    name: 'Innovation Labs',
    dailyRate: '$350',
    notes: 'Annual partnership sponsor',
  },
  {
    id: 3,
    name: 'Digital Ventures',
    dailyRate: '$450',
    notes: null,
  },
];

export const mockSponsorPasses: SponsorPass[] = [
  {
    id: 1,
    sponsor: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@techcorp.com',
    status: 'active',
    createdAt: '2026-01-01T10:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    revokedAt: null,
  },
  {
    id: 2,
    sponsor: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    status: 'active',
    createdAt: '2026-01-02T14:30:00Z',
    expiresAt: null,
    revokedAt: null,
  },
  {
    id: 3,
    sponsor: 1,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@techcorp.com',
    status: 'revoked',
    createdAt: '2025-12-15T09:00:00Z',
    expiresAt: '2026-06-30T23:59:59Z',
    revokedAt: '2026-01-03T16:45:00Z',
  },
  {
    id: 4,
    sponsor: 2,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@innovationlabs.com',
    status: 'active',
    createdAt: '2026-01-01T08:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    revokedAt: null,
  },
  {
    id: 5,
    sponsor: 2,
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@innovationlabs.com',
    status: 'active',
    createdAt: '2026-01-03T11:20:00Z',
    expiresAt: null,
    revokedAt: null,
  },
  {
    id: 6,
    sponsor: 3,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@digitalventures.com',
    status: 'revoked',
    createdAt: '2026-01-04T15:00:00Z',
    expiresAt: '2026-03-31T23:59:59Z',
    revokedAt: null,
  },
  {
    id: 7,
    sponsor: 3,
    firstName: 'Robert',
    lastName: 'Miller',
    email: 'robert.miller@digitalventures.com',
    status: 'revoked',
    createdAt: '2025-12-20T10:30:00Z',
    expiresAt: null,
    revokedAt: '2025-12-28T13:15:00Z',
  },
];

// Empty sponsor passes for testing no-data scenarios
export const mockEmptySponsorPasses: SponsorPass[] = [];

// Helper function to get passes for a specific sponsor
export function getMockPassesForSponsor(
  sponsorId: number,
  options?: {
    includeRevoked?: boolean;
    limit?: number;
    offset?: number;
    useEmptyData?: boolean;
  }
): { results: SponsorPass[]; count: number } {
  const { includeRevoked = false, limit = 10, offset = 0, useEmptyData = false } = options || {};

  // Return empty data if requested
  if (useEmptyData) {
    return { results: [], count: 0 };
  }

  let passes = mockSponsorPasses.filter((pass) => pass.sponsor === sponsorId);

  if (!includeRevoked) {
    passes = passes.filter((pass) => pass.status === 'active');
  }

  const count = passes.length;
  const results = passes.slice(offset, offset + limit);

  return { results, count };
}
