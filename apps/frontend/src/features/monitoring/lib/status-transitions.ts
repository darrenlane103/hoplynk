import { NetworkInterface, Metric, LinkType } from '@/features/monitoring/types';

export interface StatusTransition {
  timestamp: string;
  interfaceName: string;
  linkType: LinkType;
  fromStatus: string;
  toStatus: string;
  score: number;
}

export function getStatusTransitions(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): StatusTransition[] {
  const transitions: StatusTransition[] = [];

  for (const iface of interfaces) {
    const interfaceMetrics = metrics
      .filter((m) => m.interface_id === iface.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let previousStatus: string | null = null;

    for (const metric of interfaceMetrics) {
      if (previousStatus !== null && previousStatus.toLowerCase() !== metric.status.toLowerCase()) {
        transitions.push({
          timestamp: metric.timestamp,
          interfaceName: iface.name,
          linkType: iface.link_type,
          fromStatus: previousStatus,
          toStatus: metric.status,
          score: metric.score,
        });
      }
      previousStatus = metric.status;
    }
  }

  return transitions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

