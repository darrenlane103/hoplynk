import { Metric } from '@/features/monitoring/types';
import { formatDistanceToNow } from 'date-fns';

export function getLatestMetricForInterface(
  metrics: Metric[],
  interfaceId: string,
): Metric | null {
  const interfaceMetrics = metrics.filter((m) => m.interface_id === interfaceId);
  if (interfaceMetrics.length === 0) return null;

  return interfaceMetrics.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
  });
}

export function formatLinkType(linkType: string): string {
  const typeMap: Record<string, string> = {
    ethernet: 'Ethernet',
    wifi: 'Wi-Fi',
    cellular: 'Cellular',
    satellite: 'Satellite',
  };
  return typeMap[linkType.toLowerCase()] || linkType;
}

export function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

