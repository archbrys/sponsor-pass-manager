import { useState, useEffect, useCallback } from 'react';
import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { SponsorSelector } from './SponsorSelector';
import { PassFilters } from './PassFilters';
import { PassList } from './PassList';
import { CreatePassModal } from './CreatePassModal';
import type { Sponsor, SponsorPass, PaginatedResponse, CreateSponsorPassRequest } from '@/types';

interface SponsorPassManagerProps {
  sdk: FrontierSDK;
}

export function SponsorPassManager({ sdk }: SponsorPassManagerProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(null);
  const [passes, setPasses] = useState<SponsorPass[]>([]);
  const [totalPasses, setTotalPasses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [includeRevoked, setIncludeRevoked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load sponsors on mount
  useEffect(() => {
    async function loadSponsors() {
      try {
        const response = await sdk.getPartnerships().listSponsors();
        setSponsors(response.results);

        if (response.results.length > 0) {
          setSelectedSponsorId(response.results[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sponsors');
      }
    }

    loadSponsors();
  }, [sdk]);

  // Load passes when sponsor, page, or filter changes
  const loadPasses = useCallback(async () => {
    if (!selectedSponsorId) return;

    setIsLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      let response: PaginatedResponse<SponsorPass>;

      if (includeRevoked) {
        response = await sdk.getPartnerships().listAllSponsorPasses({
          limit: pageSize,
          offset,
          includeRevoked: true,
        });
      } else {
        response = await sdk.getPartnerships().listActiveSponsorPasses({
          limit: pageSize,
          offset,
        });
      }

      // Filter passes by selected sponsor
      const filteredPasses = response.results.filter((pass) => pass.sponsor === selectedSponsorId);
      setPasses(filteredPasses);
      setTotalPasses(response.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load passes');
    } finally {
      setIsLoading(false);
    }
  }, [sdk, selectedSponsorId, currentPage, pageSize, includeRevoked]);

  useEffect(() => {
    loadPasses();
  }, [loadPasses]);

  const handleSponsorChange = (sponsorId: number) => {
    setSelectedSponsorId(sponsorId);
    setCurrentPage(1);
  };

  const handleIncludeRevokedChange = (checked: boolean) => {
    setIncludeRevoked(checked);
    setCurrentPage(1);
  };

  const handleRevoke = async (passId: number, passName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke the pass for ${passName}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await sdk.getPartnerships().revokeSponsorPass({ id: passId });
      await loadPasses();
    } catch (err) {
      alert(`Failed to revoke pass: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCreatePass = async (data: Omit<CreateSponsorPassRequest, 'sponsor'>) => {
    if (!selectedSponsorId) return;

    await sdk.getPartnerships().createSponsorPass({
      ...data,
      sponsor: selectedSponsorId,
    });

    await loadPasses();
  };

  if (sponsors.length === 0 && !isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-white text-center">Sponsor Pass Manager</h1>
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <p className="text-center text-muted-foreground">
            No sponsors found. You need to be assigned as a sponsor manager.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold text-white text-center">Sponsor Pass Manager</h1>

      <SponsorSelector
        sdk={sdk}
        sponsors={sponsors}
        selectedSponsorId={selectedSponsorId}
        onSponsorChange={handleSponsorChange}
        onCreatePassClick={() => setShowCreateModal(true)}
      />

      <PassFilters
        includeRevoked={includeRevoked}
        onIncludeRevokedChange={handleIncludeRevokedChange}
      />

      <PassList
        passes={passes}
        totalPasses={totalPasses}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isLoading}
        error={error}
        onRevoke={handleRevoke}
        onPageChange={setCurrentPage}
      />

      <CreatePassModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePass}
      />
    </div>
  );
}
