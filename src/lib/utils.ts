import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date using CET (Central European Time) timezone.
 *
 * @param date - The date to format (Date object, ISO string, or timestamp).
 * @param options - Optional Intl.DateTimeFormat options to customize the format.
 * @returns A formatted date string in CET timezone.
 *
 * @example
 * formatDateCET(new Date()) // "1/5/2026, 2:30:45 PM"
 * formatDateCET(new Date(), { dateStyle: 'full' }) // "Sunday, January 5, 2026"
 * formatDateCET(new Date(), { dateStyle: 'medium', timeStyle: 'short' }) // "Jan 5, 2026, 2:30 PM"
 */
export function formatDateCET(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Paris', // CET timezone
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
}
