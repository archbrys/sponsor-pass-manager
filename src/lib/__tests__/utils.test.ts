import { describe, it, expect } from 'vitest';
import { cn, formatDateCET } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles conditional class names', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toBe('base-class conditional-class');
    });

    it('resolves Tailwind class conflicts (last one wins)', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('handles arrays of class names', () => {
      const result = cn(['text-red-500', 'font-bold'], 'bg-white');
      expect(result).toBe('text-red-500 font-bold bg-white');
    });

    it('handles objects with conditional classes', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'font-bold': true,
      });
      expect(result).toBe('text-red-500 font-bold');
    });

    it('handles undefined and null values gracefully', () => {
      const result = cn('text-red-500', undefined, null, 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('deduplicates identical classes', () => {
      const result = cn('text-red-500', 'text-red-500', 'font-bold');
      expect(result).toBe('text-red-500 font-bold');
    });

    it('handles complex real-world scenarios', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'px-4 py-2 rounded',
        isActive && 'bg-blue-500 text-white',
        isDisabled && 'opacity-50 cursor-not-allowed',
        'hover:bg-blue-600'
      );
      expect(result).toBe('px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600');
    });
  });

  describe('formatDateCET', () => {
    it('formats Date object with default options', () => {
      const date = new Date('2025-06-15T10:30:00Z');
      const result = formatDateCET(date);
      // Result should be in CET timezone format
      expect(result).toMatch(/6\/15\/2025/);
    });

    it('formats ISO string date', () => {
      const isoString = '2025-12-25T18:45:00Z';
      const result = formatDateCET(isoString);
      expect(result).toMatch(/12\/25\/2025/);
    });

    it('formats timestamp number', () => {
      const timestamp = new Date('2025-03-10T08:00:00Z').getTime();
      const result = formatDateCET(timestamp);
      expect(result).toMatch(/3\/10\/2025/);
    });

    it('formats with custom dateStyle option', () => {
      const date = new Date('2025-01-05T12:00:00Z');
      const result = formatDateCET(date, { dateStyle: 'full' });
      expect(result).toMatch(/January 5, 2025/);
      expect(result).toMatch(/Sunday/);
    });

    it('formats with medium dateStyle and short timeStyle', () => {
      const date = new Date('2025-01-05T14:30:00Z');
      const result = formatDateCET(date, { dateStyle: 'medium', timeStyle: 'short' });
      expect(result).toMatch(/Jan 5, 2025/);
      // Time will vary based on CET offset, just check it has time
      expect(result).toMatch(/[0-9]{1,2}:[0-9]{2}\s[AP]M/);
    });

    it('formats with custom time options', () => {
      const date = new Date('2025-01-05T12:00:00Z');
      const result = formatDateCET(date, { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      expect(result).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);
    });

    it('formats with long dateStyle', () => {
      const date = new Date('2025-01-05T12:00:00Z');
      const result = formatDateCET(date, { dateStyle: 'long' });
      expect(result).toMatch(/January 5, 2025/);
    });

    it('uses CET timezone (Europe/Paris)', () => {
      // Create a date at midnight UTC
      const date = new Date('2025-01-05T00:00:00Z');
      const result = formatDateCET(date, { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      // CET is UTC+1, so midnight UTC should be 01:00 in CET
      expect(result).toMatch(/01:00/);
    });

    it('handles date during daylight saving time', () => {
      // Summer date when CEST (UTC+2) is active
      const date = new Date('2025-07-15T00:00:00Z');
      const result = formatDateCET(date, { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      // CEST is UTC+2, so midnight UTC should be 02:00 in CEST
      expect(result).toMatch(/02:00/);
    });

    it('formats with year, month, and day options', () => {
      const date = new Date('2025-01-05T12:00:00Z');
      const result = formatDateCET(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      expect(result).toBe('January 5, 2025');
    });

    it('handles edge case of year boundary', () => {
      const date = new Date('2024-12-31T23:30:00Z');
      const result = formatDateCET(date, { dateStyle: 'short' });
      // CET is UTC+1, so 23:30 UTC on Dec 31 becomes Jan 1 in CET
      expect(result).toMatch(/1\/1\/25/);
    });
  });
});
