import { useState } from 'react';
import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Sponsor } from '@/types';

interface SponsorSelectorProps {
  sdk: FrontierSDK;
  sponsors: Sponsor[];
  selectedSponsorId: number | null;
  onSponsorChange: (sponsorId: number) => void;
  onCreatePassClick: () => void;
}

export function SponsorSelector({
  sponsors,
  selectedSponsorId,
  onSponsorChange,
  onCreatePassClick,
}: SponsorSelectorProps) {
  const selectedSponsor = sponsors.find((s) => s.id === selectedSponsorId);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <Label htmlFor="sponsor-select">Select Sponsor</Label>
            <Select
              value={selectedSponsorId?.toString()}
              onValueChange={(value) => onSponsorChange(parseInt(value))}
            >
              <SelectTrigger id="sponsor-select" className="w-full sm:max-w-xs">
                <SelectValue placeholder="Select a sponsor" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor) => (
                  <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onCreatePassClick} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Pass
          </Button>
        </div>
      </CardHeader>
      {selectedSponsor && (
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Daily Rate:</strong> {selectedSponsor.dailyRate}
            </p>
            {selectedSponsor.notes && (
              <p>
                <strong>Notes:</strong> {selectedSponsor.notes}
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
