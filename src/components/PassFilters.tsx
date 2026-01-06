import { Card, CardContent } from '@/ui/card';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';

interface PassFiltersProps {
  includeRevoked: boolean;
  onIncludeRevokedChange: (checked: boolean) => void;
}

export function PassFilters({ includeRevoked, onIncludeRevokedChange }: PassFiltersProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="include-revoked"
            checked={includeRevoked}
            onCheckedChange={(checked) => onIncludeRevokedChange(checked === true)}
          />
          <Label htmlFor="include-revoked" className="cursor-pointer text-sm font-medium leading-none">
            Show Revoked
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
