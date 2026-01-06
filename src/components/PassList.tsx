import { ChevronLeft, ChevronRight, LayoutGrid, Table as TableIcon, Mail, Trash2, CheckCircle, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Alert, AlertDescription } from '@/ui/alert';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { formatDateCET } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Pagination, PaginationContent, PaginationItem } from '@/ui/pagination';
import type { SponsorPass } from '@/types';

interface PassListProps {
  passes: SponsorPass[];
  totalPasses: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  includeRevoked: boolean;
  viewLayout: 'grid' | 'table';
  onViewLayoutChange: (layout: 'grid' | 'table') => void;
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
  viewLayout,
  onViewLayoutChange,
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
    <Card className="bg-white/90 backdrop-blur-md border-white/40 shadow-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Sponsor Passes</CardTitle>
          {totalPasses > 0 && (
            <Badge variant="primary" size="sm" className="font-semibold">
              {totalPasses}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-revoked"
              checked={includeRevoked}
              onCheckedChange={(checked) => onIncludeRevokedChange(checked === true)}
            />
            <Label htmlFor="include-revoked" className="cursor-pointer text-sm font-medium leading-none">
              Show Revoked
            </Label>
          </div>
          <div className="flex items-center gap-1 border border-border rounded-md">
            <Button
              variant={viewLayout === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewLayoutChange('grid')}
              className="rounded-r-none"
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewLayout === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewLayoutChange('table')}
              className="rounded-l-none"
              title="Table view"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
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
            {viewLayout === 'table' ? (
              <Card className="bg-white/90 backdrop-blur-md border-white/40 shadow-lg overflow-hidden">
                <CardContent className="p-0">
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
                          className={`*:border-border hover:bg-white/50 [&>:not(:last-child)]:border-r ${pass.status === 'revoked' ? 'opacity-50' : ''}`}
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
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {passes.map((pass) => {
                  const initials = `${pass.firstName.charAt(0)}${pass.lastName.charAt(0)}`.toUpperCase();
                  const avatarColors = [
                    'bg-purple-500',
                    'bg-green-500',
                    'bg-blue-500',
                    'bg-orange-500',
                    'bg-pink-500',
                    'bg-teal-500',
                  ];
                  const colorIndex = pass.id % avatarColors.length;
                  
                  return (
                    <Card 
                      key={pass.id} 
                      className={`bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${pass.status === 'revoked' ? 'opacity-60' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
                            {/* Avatar */}
                            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0">
                              <AvatarFallback className={`${avatarColors[colorIndex]} text-white font-semibold text-base sm:text-lg border-0`}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                                  {pass.firstName} {pass.lastName}
                                </h3>
                                <Badge 
                                  variant={pass.status === 'active' ? 'success' : 'destructive'}
                                  size="sm"
                                  className="shrink-0"
                                >
                                  {pass.status === 'active' ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-3 w-3 mr-1" />
                                      Revoked
                                    </>
                                  )}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                <span className="text-xs sm:text-sm truncate">{pass.email}</span>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                <span className="text-xs sm:text-sm truncate">
                                  {pass.expiresAt ? (
                                    <>
                                      <span className="hidden sm:inline">
                                        {formatDateCET(pass.expiresAt, { dateStyle: 'medium' })}
                                      </span>
                                      <span className="sm:hidden">
                                        {formatDateCET(pass.expiresAt, { dateStyle: 'short' })}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="hidden sm:inline">No Expiration</span>
                                      <span className="sm:hidden">None</span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Revoke Button */}
                          {pass.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onRevoke(pass.id, `${pass.firstName} ${pass.lastName}`)}
                              title="Revoke pass"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="shrink-0 text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalPasses)} of {totalPasses} passes
                </div>
                <div>
                  <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <Button
                          variant={page === currentPage ? 'outline' : 'ghost'}
                          size="sm"
                          onClick={() => onPageChange(page)}
                          className="min-w-10"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                </div>
                
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
