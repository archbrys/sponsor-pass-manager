import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Alert, AlertDescription } from '@/ui/alert';
import { formatDateCET } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import type { SponsorPass } from '@/types';

interface PassListProps {
  passes: SponsorPass[];
  totalPasses: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  includeRevoked: boolean;
  onIncludeRevokedChange: (checked: boolean) => void;
  onRevoke: (passId: number, passName: string) => void;
  onPageChange: (page: number) => void;
}

export function PassList({
  passes,
  totalPasses,
  currentPage,
  pageSize,
  isLoading,
  error,
  includeRevoked,
  onIncludeRevokedChange,
  onRevoke,
  onPageChange,
}: PassListProps) {
  const totalPages = Math.ceil(totalPasses / pageSize);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading passes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Sponsor Passes</CardTitle>
          {totalPasses > 0 && (
            <Badge variant="primary" size="sm" className="font-semibold">
              {totalPasses}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="include-revoked"
            checked={includeRevoked}
            onCheckedChange={(checked) => onIncludeRevokedChange(checked === true)}
          />
          <Label htmlFor="include-revoked" className="cursor-pointer text-sm font-medium leading-none">
            Show Revoked Passes
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        {passes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <img src="/no-passes.svg" alt="No passes" className="w-32 h-32" />
            <p className="text-sm text-muted-foreground">
              No passes found for this sponsor.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="border-0">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passes.map((pass) => (
                    <TableRow 
                      key={pass.id} 
                      className={`*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r ${pass.status === 'revoked' ? 'opacity-50' : ''}`}
                    >
                      <TableCell className="font-medium">
                        {pass.firstName} {pass.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{pass.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={pass.status === 'active' ? 'success' : 'destructive'}
                        >
                          {pass.status === 'active' ? '✓ Active' : '✗ Revoked'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pass.expiresAt ? (
                          <span className="text-sm">{formatDateCET(pass.expiresAt, { dateStyle: 'medium' })}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No expiration</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateCET(pass.createdAt, { dateStyle: 'medium' })}
                      </TableCell>
                      <TableCell>
                        {pass.status === 'active' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              onRevoke(pass.id, `${pass.firstName} ${pass.lastName}`)
                            }
                          >
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Revoked{' '}
                            {pass.revokedAt && formatDateCET(pass.revokedAt, { dateStyle: 'medium' })}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalPasses)} of {totalPasses} passes
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
