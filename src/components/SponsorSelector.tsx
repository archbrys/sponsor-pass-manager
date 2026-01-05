import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Label } from '@/ui/label';
import type { Sponsor } from '@/types';

interface SponsorSelectorProps {
  sdk: FrontierSDK;
  sponsors: Sponsor[];
  selectedSponsorId: number | null;
  totalPasses?: number;
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
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 flex-1">
            <div className="space-y-1.5">
              <Label 
                htmlFor="sponsor-select" 
                className="text-sm font-semibold text-foreground/90 uppercase tracking-wide"
              >
                Select Sponsor
              </Label>
              <p className="text-xs text-muted-foreground">
                Choose a sponsor to view and manage their passes
              </p>
            </div>
            <Select
              value={selectedSponsorId?.toString() || ''}
              onValueChange={(value) => onSponsorChange(parseInt(value))}
            >
              <SelectTrigger 
                id="sponsor-select" 
                className="w-full sm:max-w-md h-11 text-base font-medium border-2 hover:border-foreground/30 transition-colors"
              >
                <SelectValue placeholder="Choose a sponsor..." />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor) => (
                  <SelectItem 
                    key={sponsor.id} 
                    value={sponsor.id.toString()}
                    className="text-base py-2.5"
                  >
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedSponsorId && (
            <Button 
              onClick={onCreatePassClick} 
              className="w-full sm:w-auto h-11 px-6 font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Pass
            </Button>
          )}
        </div>
      </CardHeader>
      {selectedSponsor && (
        <CardContent className="pt-0 border-t bg-muted/30">
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground/80 uppercase tracking-wide text-xs">Daily Rate:</span>
                <span className="text-base font-semibold text-foreground">{selectedSponsor.dailyRate}</span>
              </div>
            </div>
            {selectedSponsor.notes && (
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-foreground/80 uppercase tracking-wide text-xs">Notes:</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedSponsor.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
