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
      <CardContent className="py-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="include-revoked"
            checked={includeRevoked}
            onCheckedChange={(checked) => onIncludeRevokedChange(checked === true)}
          />
          <Label htmlFor="include-revoked" className="cursor-pointer text-sm font-medium">
            Show Revoked Passes
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
