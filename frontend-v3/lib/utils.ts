import { format, formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, h:mm a');
}

export function formatTimeDistance(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getSuburbTypeColor(suburbType: string): string {
  switch (suburbType) {
    case 'Inner-Ring Suburb':
      return 'bg-emerald-100 text-emerald-800';
    case 'General Suburb':
      return 'bg-blue-100 text-blue-800';
    case 'Exurban Suburb':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

