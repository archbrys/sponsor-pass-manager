import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Alert } from '@/ui/alert';
import { CalendarDays, Mail, User } from 'lucide-react';
import type { CreateSponsorPassRequest } from '@/types';

interface CreatePassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreateSponsorPassRequest, 'sponsor'>) => Promise<void>;
}

export function CreatePassModal({ open, onOpenChange, onSubmit }: CreatePassModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    expiresAt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() }),
      });

      // Show success toast
      toast.success('Pass created successfully!', {
        description: `Created pass for ${formData.firstName} ${formData.lastName}`,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        expiresAt: '',
      });
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create pass';
      setError(errorMessage);
      toast.error('Failed to create pass', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      expiresAt: '',
    });
    setError(null);
    onOpenChange(false);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Sponsor Pass</DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Enter the recipient's details to generate a new sponsor pass. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" appearance="light" className="text-sm">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-semibold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                First Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                required
                variant="lg"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                disabled={isSubmitting}
                className="font-medium"
                autoComplete="given-name"
              />
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Last Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                required
                variant="lg"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                disabled={isSubmitting}
                className="font-medium"
                autoComplete="family-name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                variant="lg"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                disabled={isSubmitting}
                className="font-medium"
                autoComplete="email"
              />
            </div>

            {/* Expiration Date Field */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-sm font-semibold flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                Expiration Date
                <span className="text-muted-foreground text-xs font-normal ml-auto">(Optional)</span>
              </Label>
              <Input
                id="expiresAt"
                type="date"
                variant="lg"
                min={today}
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                disabled={isSubmitting}
                className="font-medium"
              />
              <p className="text-xs text-muted-foreground/70 mt-1">
                Leave blank for passes that don't expire
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="font-semibold min-w-[120px]"
            >
              {isSubmitting ? 'Creating...' : 'Create Pass'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
