import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SponsorPass } from '@/types';

interface PassListProps {
  passes: SponsorPass[];
  totalPasses: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
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
  onRevoke,
  onPageChange,
}: PassListProps) {
  const totalPages = Math.ceil(totalPasses / pageSize);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading passes...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sponsor Passes ({totalPasses})</CardTitle>
      </CardHeader>
      <CardContent>
        {passes.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground italic">
            No passes found for this sponsor.
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passes.map((pass) => (
                    <TableRow key={pass.id} className={pass.status === 'revoked' ? 'opacity-60' : ''}>
                      <TableCell className="font-medium">
                        {pass.firstName} {pass.lastName}
                      </TableCell>
                      <TableCell>{pass.email}</TableCell>
                      <TableCell>
                        <Badge variant={pass.status === 'active' ? 'success' : 'destructive'}>
                          {pass.status === 'active' ? '✓ Active' : '✗ Revoked'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pass.expiresAt ? new Date(pass.expiresAt).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>{new Date(pass.createdAt).toLocaleDateString()}</TableCell>
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
                          <span className="text-xs text-muted-foreground italic">
                            Revoked{' '}
                            {pass.revokedAt ? new Date(pass.revokedAt).toLocaleDateString() : ''}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
