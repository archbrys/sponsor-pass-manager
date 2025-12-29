import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PassFiltersProps {
  includeRevoked: boolean;
  onIncludeRevokedChange: (checked: boolean) => void;
}

export function PassFilters({ includeRevoked, onIncludeRevokedChange }: PassFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-revoked"
            checked={includeRevoked}
            onCheckedChange={(checked) => onIncludeRevokedChange(checked === true)}
          />
          <Label htmlFor="include-revoked" className="cursor-pointer">
            Show Revoked Passes
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
