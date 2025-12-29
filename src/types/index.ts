export interface Sponsor {
  id: number;
  name: string;
  dailyRate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorPass {
  id: number;
  sponsor: number;
  sponsorName: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'revoked';
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export interface CreateSponsorPassRequest {
  sponsor: number;
  firstName: string;
  lastName: string;
  email: string;
  expiresAt?: string;
}
