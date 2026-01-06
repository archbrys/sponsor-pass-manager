import { useState, useEffect, useCallback } from 'react';
import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { PassList } from './PassList';
import { CreatePassModal } from './CreatePassModal';
import { ConfirmDialog } from './ConfirmDialog';
import { mockSponsors, getMockPassesForSponsor } from '@/lib/mockData';
import type { Sponsor, SponsorPass, PaginatedResponse, CreateSponsorPassRequest } from '@/types';

// Toggle this to use mock data for testing
const USE_MOCK_DATA = true;

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
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);
  const [isLoadingPasses, setIsLoadingPasses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [passToRevoke, setPassToRevoke] = useState<{ id: number; name: string } | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Load sponsors on mount
  useEffect(() => {
    async function loadSponsors() {
      setIsLoadingSponsors(true);
      try {
        if (USE_MOCK_DATA) {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          setSponsors(mockSponsors);
        } else {
          const response = await sdk.getPartnerships().listSponsors();
          setSponsors(response.results);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load sponsors';
        setError(errorMessage);
        toast.error('Failed to load sponsors', {
          description: errorMessage,
        });
      } finally {
        setIsLoadingSponsors(false);
      }
    }

    loadSponsors();
  }, [sdk]);

  // Load passes when sponsor, page, or filter changes
  const loadPasses = useCallback(async () => {
    if (!selectedSponsorId) return;

    setIsLoadingPasses(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const offset = (currentPage - 1) * pageSize;
        const mockData = getMockPassesForSponsor(selectedSponsorId, {
          includeRevoked,
          limit: pageSize,
          offset,
        });
        setPasses(mockData.results);
        setTotalPasses(mockData.count);
      } else {
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
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load passes';
      setError(errorMessage);
      toast.error('Failed to load passes', {
        description: errorMessage,
      });
    } finally {
      setIsLoadingPasses(false);
    }
  }, [sdk, selectedSponsorId, currentPage, pageSize, includeRevoked]);

  useEffect(() => {
    loadPasses();
  }, [loadPasses]);

  const handleSponsorChange = (sponsorId: number) => {
    setSelectedSponsorId(sponsorId);
    setCurrentPage(1);
    setIncludeRevoked(false);
  };

  const handleIncludeRevokedChange = (checked: boolean) => {
    setIncludeRevoked(checked);
    setCurrentPage(1);
  };

  const handleRevoke = (passId: number, passName: string) => {
    setPassToRevoke({ id: passId, name: passName });
    setShowConfirmDialog(true);
  };

  const confirmRevoke = async () => {
    if (!passToRevoke) return;

    try {
      if (USE_MOCK_DATA) {
        // Simulate revoke with mock data
        await new Promise((resolve) => setTimeout(resolve, 300));
        console.log(`Mock: Revoked pass ${passToRevoke.id}`);
      } else {
        await sdk.getPartnerships().revokeSponsorPass({ id: passToRevoke.id });
      }
      
      toast.success('Pass revoked successfully', {
        description: `Pass for ${passToRevoke.name} has been revoked`,
      });
      
      await loadPasses();
    } catch (err) {
      const errorMessage = `Failed to revoke pass: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      toast.error('Failed to revoke pass', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setPassToRevoke(null);
    }
  };

  const handleCreatePass = async (data: Omit<CreateSponsorPassRequest, 'sponsor'>) => {
    if (!selectedSponsorId) return;

    if (USE_MOCK_DATA) {
      // Simulate create with mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Mock: Created pass', { ...data, sponsor: selectedSponsorId });
    } else {
      await sdk.getPartnerships().createSponsorPass({
        ...data,
        sponsor: selectedSponsorId,
      });
    }

    await loadPasses();
  };

  // Show loading screen while fetching sponsors
  if (isLoadingSponsors) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg text-white">Loading sponsors...</p>
        </div>
      </div>
    );
  }

  // Show message if no sponsors found
  if (sponsors.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <img src="/no-sponsor.svg" alt="No sponsors" className="w-48 h-auto mx-auto" />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">No Sponsors Found</h1>
            <p className="text-xl text-white/90">
              You need to be assigned as a sponsor manager to access this feature.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <p className="text-white/80 leading-relaxed">
              Please contact your administrator to request sponsor manager access and start managing sponsor passes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show only selector when no sponsor is selected
  if (!selectedSponsorId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-white">Sponsor Pass Manager</h1>
            <p className="text-lg text-white/80">Select a sponsor to manage their passes</p>
          </div>
          <div className="space-y-3">
            <label 
              htmlFor="sponsor-select-initial" 
              className="block text-sm font-semibold text-white/90 uppercase tracking-wide"
            >
              Select Sponsor
            </label>
            <select
              id="sponsor-select-initial"
              value={selectedSponsorId?.toString() || ''}
              onChange={(e) => handleSponsorChange(parseInt(e.target.value))}
              className="w-full h-12 px-4 text-base font-medium bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg text-white hover:border-white/40 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
            >
              <option value="" disabled className="bg-background text-foreground">
                Choose a sponsor...
              </option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id} className="bg-background text-foreground">
                  {sponsor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="flex-1 w-full sm:max-w-md space-y-2">
          <label 
            htmlFor="sponsor-select" 
            className="block text-sm font-semibold text-white/90 uppercase tracking-wide"
          >
            Select Sponsor
          </label>
          <select
            id="sponsor-select"
            value={selectedSponsorId?.toString() || ''}
            onChange={(e) => handleSponsorChange(parseInt(e.target.value))}
            className="w-full h-11 px-4 text-base font-medium bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg text-white hover:border-white/40 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
          >
            {sponsors.map((sponsor) => (
              <option key={sponsor.id} value={sponsor.id} className="bg-background text-foreground">
                {sponsor.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto h-11 px-6 font-semibold inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/60 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
          Create New Pass
        </button>
      </div>

      <PassList
        passes={passes}
        totalPasses={totalPasses}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isLoadingPasses}
        error={error}
        includeRevoked={includeRevoked}
        viewLayout={viewLayout}
        onViewLayoutChange={setViewLayout}
        onIncludeRevokedChange={handleIncludeRevokedChange}
        onRevoke={handleRevoke}
        onPageChange={setCurrentPage}
      />

      <CreatePassModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePass}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmRevoke}
        title="Revoke Sponsor Pass"
        description={`Are you sure you want to revoke the pass for ${passToRevoke?.name}? This action cannot be undone.`}
        confirmText="Revoke Pass"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
