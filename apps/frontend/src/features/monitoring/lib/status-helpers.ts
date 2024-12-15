import { Status } from '@/features/monitoring/types';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'down':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusBadgeColor(status: Status): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'degraded':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'down':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusColorForTransition(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
      return 'text-green-600 bg-green-50';
    case 'degraded':
      return 'text-yellow-600 bg-yellow-50';
    case 'down':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

