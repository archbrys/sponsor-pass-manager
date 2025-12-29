import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
          <Alert variant="destructive" appearance="light">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No passes found for this sponsor.
            </p>
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
                    <TableRow 
                      key={pass.id} 
                      className={pass.status === 'revoked' ? 'opacity-50' : ''}
                    >
                      <TableCell className="font-medium">
                        {pass.firstName} {pass.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{pass.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={pass.status === 'active' ? 'success' : 'destructive'}
                          appearance="light"
                          size="sm"
                        >
                          {pass.status === 'active' ? '✓ Active' : '✗ Revoked'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pass.expiresAt ? (
                          <span className="text-sm">{new Date(pass.expiresAt).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No expiration</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(pass.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {pass.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onRevoke(pass.id, `${pass.firstName} ${pass.lastName}`)
                            }
                            className="text-destructive hover:bg-destructive/10 border-destructive/20"
                          >
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Revoked{' '}
                            {pass.revokedAt && new Date(pass.revokedAt).toLocaleDateString()}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t">
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
